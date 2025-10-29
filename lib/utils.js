// import { clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs) {
//   return twMerge(clsx(inputs))
// }

// export function formatPrice(price) {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "GHS",
//   }).format(price)
// }

// export function formatDate(date) {
//   return new Intl.DateTimeFormat("en-NG", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(new Date(date))
// }

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(amount);
};


export function formatPrice(price) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "GHS",
  }).format(price)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}
