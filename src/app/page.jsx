import { paytone_One } from "../../utils/fonts";
import dynamic from "next/dynamic";
import LoadingData from "./loading";

const BookPage = dynamic(() => import("./components/BooksContainer"), {
  ssr: false,
  loading: LoadingData,
});

export default function Home() {
  return (
    <main className="min-h-screen w-full pt-14 px-4">
      <BookPage />
    </main>
  );
}
