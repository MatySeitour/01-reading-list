"use client"

import Image from "next/image";
import booksData from "../../../utils/books.json"
import { BooksAvailable } from "./BooksAvailable";
import { useEffect, useMemo, useState } from "react"

export const BooksContainer = () => {
    const { library } = booksData;
    const [booksAvailable, setBooksAvailable] = useState(library);
    const [myListBook, setMyListBook] = useState([]);
    const [genreSelected, setGenreSelected] = useState("Todos");

    const addMyListBook = (bookSelected) => {
        const booksInMyList = myListBook;
        const oldListBooks = booksAvailable.filter(item => item.book.title != bookSelected.title);

        booksInMyList.push(bookSelected);
        setBooksAvailable(oldListBooks)
        console.log(booksAvailable)
        setMyListBook(booksInMyList);
    }

    const booksFilter = useMemo(() => {
        console.log(booksAvailable)
        if (genreSelected === "Todos") {
            return booksAvailable
        }
        else {
            return booksAvailable.filter((book) => {
                if (book.book.genre != genreSelected) return false;
                return true;
            })

        }
    }, [genreSelected, booksAvailable])


    const genreList = library.reduce((acc, item) => {
        if (!acc.includes(item.book.genre)) {
            acc.push(item.book.genre);
        }
        return acc;
    }, [])




    // useEffect(() => {
    //     console.log("numero de libros disponibles", booksAvailable)
    //     console.log("numero de libros en mi lista", myListBook)
    // }, [booksAvailable])

    return (
        <div className="h-auto p-4 w-full border border-white/30 ">
            <BooksAvailable booksLength={booksAvailable.length} />
            <div>
                <select className="text-black" value={genreSelected} onChange={(e) => setGenreSelected(e.target.value)}>
                    <option key={1231} value="Todos">Todos</option>
                    {genreList.map((genre) => (
                        <option key={genre} className="text-black" value={genre}>{genre}</option>
                    ))}
                </select>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
                {booksFilter.map((book) => (
                    <li onClick={() => addMyListBook(book.book)} className="rounded-md" key={book.book.title}>
                        <p className={`text-white ${myListBook.includes(book.book.title) && `text-red-500`}`}>{book.book.title}</p>
                        <Image width={1000} height={1000} className="rounded-md w-full h-full object-cover" alt={book.book.title} src={book.book.cover} />
                    </li>
                ))}
            </ul>
        </div>
    )
}