import { BooksContainer } from "./components/BooksContainer";
import { paytone_One } from "../../utils/fonts";

export default function Home() {
  return (
    <main className="min-h-screen w-full pt-20 px-4">
      <h1 className={`text-white text-6xl text-center mb-4 ${paytone_One.className}`}>Books Store</h1>
      <BooksContainer />
    </main>
  )
}
