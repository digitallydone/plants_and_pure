// Path: components\SearchForm.jsx
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

export function SearchForm() {
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get("make");
    window.location.href = `/vehicles?search=${searchQuery}`;
  };

  return (
    <form onSubmit={handleSearch} className="mb-8 flex justify-center gap-4">
      <div className="relative w-full ma x-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <Input
          name="make"
          placeholder="Search by make or model..."
          className="pl-10 w-full"
        />
      </div>
      <Button type="submit">
        <Filter className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}