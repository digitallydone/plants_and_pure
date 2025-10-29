import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import PDFDocument from "pdfkit"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        // shippingAddress: true,
        // billingAddress: true,
      },
    })

    // Check if order exists
    if (!order) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check if user is authorized to view this order
    // Allow if user is the order owner or an admin
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 })

    // Set response headers
    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `attachment; filename="invoice-${order.orderNumber}.pdf"`)

    // Buffer to store PDF data
    const chunks = []

    doc.on("data", (chunk) => {
      chunks.push(chunk)
    })

    // Generate PDF content
    generateInvoice(doc, order)

    // Finalize the PDF
    doc.end()

    // Return a Promise that resolves with the PDF data
    return new Promise((resolve) => {
      doc.on("end", () => {
        const pdfData = Buffer.concat(chunks)
        resolve(new NextResponse(pdfData, { headers }))
      })
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to generate invoice" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

function generateInvoice(doc, order) {
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Add company logo and information
  doc.fontSize(20).text("ADDFRA LIMITED", { align: "center" })
  doc.fontSize(10).text("123 Business Street, Lagos, Nigeria", { align: "center" })
  doc.text("Phone: +234 123 456 7890 | Email: info@addfra.com", { align: "center" })
  doc.moveDown(2)

  // Add invoice title and number
  doc.fontSize(16).text(`INVOICE #${order.orderNumber}`, { align: "center" })
  doc.moveDown()

  // Add order information
  doc.fontSize(10).text(`Date: ${orderDate}`)
  doc.text(`Order Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)
  doc.text(`Payment Status: ${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}`)
  doc.text(`Payment Method: ${order.paymentMethod}`)
  if (order.paymentReference) {
    doc.text(`Transaction ID: ${order.paymentReference}`)
  }
  doc.moveDown()

  // Add customer information
  doc.fontSize(12).text("Customer Information", { underline: true })
  doc.fontSize(10).text(`Name: ${order.user.name}`)
  doc.text(`Email: ${order.user.email}`)
  doc.moveDown()

  // Add shipping address
  if (order.shippingAddress) {
    doc.fontSize(12).text("Shipping Address", { underline: true })
    doc.fontSize(10).text(`${order.shippingAddress.fullName}`)
    doc.text(`${order.shippingAddress.streetAddress}`)
    if (order.shippingAddress.apartment) {
      doc.text(`${order.shippingAddress.apartment}`)
    }
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`)
    doc.text(`${order.shippingAddress.country}`)
    doc.text(`Phone: ${order.shippingAddress.phone}`)
    doc.moveDown()
  }

  // Add billing address if different
  if (order.billingAddress) {
    doc.fontSize(12).text("Billing Address", { underline: true })
    doc.fontSize(10).text(`${order.billingAddress.fullName}`)
    doc.text(`${order.billingAddress.streetAddress}`)
    if (order.billingAddress.apartment) {
      doc.text(`${order.billingAddress.apartment}`)
    }
    doc.text(`${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`)
    doc.text(`${order.billingAddress.country}`)
    doc.text(`Phone: ${order.billingAddress.phone}`)
    doc.moveDown()
  }

  // Add order items table
  doc.fontSize(12).text("Order Items", { underline: true })
  doc.moveDown()

  // Table header
  const tableTop = doc.y
  const itemX = 50
  const descriptionX = 150
  const quantityX = 350
  const priceX = 400
  const amountX = 450

  doc
    .fontSize(10)
    .text("Item", itemX, tableTop)
    .text("Description", descriptionX, tableTop)
    .text("Qty", quantityX, tableTop)
    .text("Price", priceX, tableTop)
    .text("Amount", amountX, tableTop)

  doc.moveDown()
  const tableRow = doc.y

  // Table rows
  order.items.forEach((item, i) => {
    const y = tableRow + i * 20

    doc
      .fontSize(10)
      .text(i + 1, itemX, y)
      .text(item.product.name, descriptionX, y, { width: 180 })
      .text(item.quantity.toString(), quantityX, y)
      .text(formatCurrency(item.price), priceX, y)
      .text(formatCurrency(item.price * item.quantity), amountX, y)
  })

  doc.moveDown(order.items.length + 1)

  // Add summary
  const summaryX = 350
  let summaryY = doc.y + 20

  doc.fontSize(10).text("Subtotal:", summaryX, summaryY).text(formatCurrency(order.subtotal), amountX, summaryY)

  summaryY += 15
  doc.text("Shipping:", summaryX, summaryY).text(formatCurrency(order.shippingCost), amountX, summaryY)

  if (order.discount > 0) {
    summaryY += 15
    doc.text("Discount:", summaryX, summaryY).text(`-${formatCurrency(order.discount)}`, amountX, summaryY)
  }

  summaryY += 15
  doc.text("Tax:", summaryX, summaryY).text(formatCurrency(order.tax), amountX, summaryY)

  summaryY += 20
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Total:", summaryX, summaryY)
    .text(formatCurrency(order.total), amountX, summaryY)

  // Add footer
  const pageHeight = doc.page.height
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Thank you for your business!", 50, pageHeight - 100, { align: "center" })
    .text("For any questions regarding this invoice, please contact our customer service.", 50, pageHeight - 80, {
      align: "center",
    })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount)
}
