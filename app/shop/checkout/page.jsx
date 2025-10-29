"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createOrder, verifyPayment } from "@/app/actions/order";
import PaystackCheckout from "@/components/paystack-checkout";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Calculate shipping and total
  const shipping = subtotal > 0 ? 50 : 0;
  const tax = 0; // You could calculate tax based on location
  const total = subtotal + shipping + tax;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "ghana",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session && typeof window !== "undefined") {
      router.push("/auth/login?callbackUrl=/shop/checkout");
    }
  }, [session, router]);

  // Update email when session changes
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email || "" }));
    }
  }, [session]);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (items.length === 0 && typeof window !== "undefined") {
      router.push("/shop");
      // toast({
      //   title: "Empty Cart",
      //   description: "Your cart is empty. Please add items before checkout.",
      // });
    }
  }, [items, router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = async () => {
    if (step === 1) {
      // Validate shipping information
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.zip
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      setStep(2);
    } else if (step === 2) {
      // Create order before proceeding to payment
      setLoading(true);

      try {
        // Prepare shipping and billing addresses
        const shippingAddress = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          phone: formData.phone,
        };

        // Use same address for billing
        const billingAddress = { ...shippingAddress };

        // Prepare order data
        const orderFormData = new FormData();
        orderFormData.append(
          "items",
          JSON.stringify(
            items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image: item.image,
            }))
          )
        );
        orderFormData.append(
          "shippingAddress",
          JSON.stringify(shippingAddress)
        );
        orderFormData.append("billingAddress", JSON.stringify(billingAddress));
        orderFormData.append("paymentMethod", paymentMethod);
        orderFormData.append("subtotal", subtotal.toString());
        orderFormData.append("shipping", shipping.toString());
        orderFormData.append("tax", tax.toString());
        orderFormData.append("total", total.toString());

        const result = await createOrder(orderFormData);

        if (result.success) {
          setOrderId(result.orderId || null);
          setStep(3);
        } else {
          const errors = result.errors || {};

          if (errors._form) {
            toast({
              title: "Error",
              description: errors._form[0],
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to create order. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error creating order:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePaystackSuccess = async (response) => {
    toast({
      title: "Payment Successful",
      description: `Your payment was successful with reference: ${response.reference}`,
    });

    // Clear the cart after successful payment
    clearCart();

    // Optionally, you can save the order ID to the session or database
    // setOrderId(response.orderId || null);
    await verifyPayment(response.reference);

    

    // Redirect to order confirmation page
    router.push(`/dashboard/orders?success=true`);
  };

  const handlePaystackCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "Your payment was cancelled.",
      variant: "destructive",
    });
  };

  if (!session) {
    // return null // Don't render anything while redirecting to login
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Redirecting to login...</h1>
        <p className="text-gray-500">Please wait...</p>
        <p className="text-gray-500">
          If you are not redirected, please{" "}
          <Link href="/auth/login" className="text-blue-500">
            click here
          </Link>
        </p>
        <div className="flex justify-center mt-4"></div>
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/shop/cart">
            <Button variant="ghost" className="p-0 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Checkout Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : 1}
            </div>
            <div
              className={`w-16 h-1 ${
                step >= 2 ? "bg-primary" : "bg-slate-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > 2 ? <Check className="h-4 w-4" /> : 2}
            </div>
            <div
              className={`w-16 h-1 ${
                step >= 3 ? "bg-primary" : "bg-slate-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Shipping Information"}
                  {step === 2 && "Payment Method"}
                  {step === 3 && "Review Order"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Region</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">Postal Code</Label>
                        <Input
                          id="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleSelectChange("country", value)
                        }
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="southafrica">
                            South Africa
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-4">
                        <RadioGroupItem value="paystack" id="paystack" />
                        <Label htmlFor="paystack" className="flex items-center">
                          <svg
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="24"
                              height="24"
                              rx="4"
                              fill="#0BA4DB"
                            />
                            <path
                              d="M7 15.2L12.0005 8L17 15.2H7Z"
                              fill="white"
                            />
                          </svg>
                          Paystack
                        </Label>
                      </div>
                      {/* Uncomment this section if you want to add more payment methods
                      <div className="flex items-center space-x-2 border rounded-md p-4">
                        <RadioGroupItem value="mobilemoney" id="mobilemoney" />
                        <Label htmlFor="mobilemoney" className="flex items-center">
                          <svg
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="24" height="24" rx="4" fill="#FFD700" />
                            <path d="M12 6V18M7 9H17M7 15H17" stroke="#000" strokeWidth="2" />
                          </svg>
                          Mobile Money
                        </Label>
                      </div> */}
                    </RadioGroup>

                    {paymentMethod === "paystack" && (
                      <div className="mt-6">
                        <p className="text-slate-600 mb-4">
                          You will be redirected to Paystack to complete your
                          payment securely.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "mobilemoney" && (
                      <div className="space-y-4 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="mobileProvider">
                            Mobile Provider
                          </Label>
                          <Select>
                            <SelectTrigger id="mobileProvider">
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mtn">
                                MTN Mobile Money
                              </SelectItem>
                              <SelectItem value="vodafone">
                                Vodafone Cash
                              </SelectItem>
                              <SelectItem value="airteltigo">
                                AirtelTigo Money
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobileNumber">Mobile Number</Label>
                          <Input
                            id="mobileNumber"
                            placeholder="Enter mobile number"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="bg-slate-50 p-4 rounded-md">
                        <p>
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>
                          {formData.address}, {formData.city}, {formData.state},{" "}
                          {formData.zip}
                        </p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="bg-slate-50 p-4 rounded-md">
                        <p className="flex items-center">
                          {paymentMethod === "paystack" && (
                            <>
                              <svg
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  width="24"
                                  height="24"
                                  rx="4"
                                  fill="#0BA4DB"
                                />
                                <path
                                  d="M7 15.2L12.0005 8L17 15.2H7Z"
                                  fill="white"
                                />
                              </svg>
                              Paystack
                            </>
                          )}
                          {paymentMethod === "mobilemoney" && (
                            <>
                              <svg
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  width="24"
                                  height="24"
                                  rx="4"
                                  fill="#FFD700"
                                />
                                <path
                                  d="M12 6V18M7 9H17M7 15H17"
                                  stroke="#000"
                                  strokeWidth="2"
                                />
                              </svg>
                              Mobile Money
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="bg-slate-50 p-4 rounded-md space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span>
                            GHS {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    onClick={handleContinue}
                    className={`${step > 1 ? "" : "ml-auto"}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                ) : paymentMethod === "paystack" ? (
                  <PaystackCheckout
                    amount={total}
                    email={formData.email}
                    // currency="USD"
                    onSuccess={handlePaystackSuccess}
                    onCancel={handlePaystackCancel}
                    metadata={{ order_id: orderId }}
                    className="bg-green-600 hover:bg-green-700"
                    buttonText="Pay with Paystack"
                  />
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700">
                    Complete Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GHS {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>GHS {shipping.toFixed(2)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>GHS {tax.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>GHS {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
