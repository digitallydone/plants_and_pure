import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get current session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    
    // If user is logged in, check their cart in database
    if (userId) {
      const cartItem = await prisma.cart.findFirst({
        where: {
          userId,
          productId
        }
      })
      
      return NextResponse.json({
        inCart: Boolean(cartItem),
        quantity: cartItem?.quantity || 0
      })
    } 
    
    // For guest users, check cart in cookies
    else {
      const cartCookie = cookies().get('cart')
      if (cartCookie) {
        try {
          const cartItems = JSON.parse(cartCookie.value)
          const cartItem = cartItems.find(item => item.id === productId)
          
          return NextResponse.json({
            inCart: Boolean(cartItem),
            quantity: cartItem?.quantity || 0
          })
        } catch (error) {
          console.error('Error parsing cart cookie:', error)
        }
      }
      
      return NextResponse.json({
        inCart: false,
        quantity: 0
      })
    }
  } catch (error) {
    console.error('Error checking cart status:', error)
    return NextResponse.json(
      { error: 'Failed to check cart status' },
      { status: 500 }
    )
  }
}