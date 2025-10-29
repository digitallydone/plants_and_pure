// Path: app/contact/page.jsx
import Footer from "@/components/Footer";
import Navbar from "@/components/NavbarTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Input, Textarea, Button } from "@nextui-org/react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container px-4 py-12 mx-auto">
        <h1 className="mb-12 text-4xl font-bold text-center">Contact Us</h1>

        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <Input label="Name" placeholder="Enter your name" fullWidth />
            <Input label="Email" placeholder="Enter your email" fullWidth />
            <Input
              label="Phone"
              placeholder="Enter your phone number"
              fullWidth
            />
            <Textarea
              label="Message"
              placeholder="Enter your message"
              fullWidth
            />
            <Button>Submit</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
