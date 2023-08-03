"use client"

import Image from "next/image";
import booksData from "../../../utils/books.json"
import { useEffect, useMemo, useState } from "react"
import { paytone_One } from "../../../utils/fonts";



export const BooksContainer = () => {
    const { library } = booksData;
    const [isbnArr, setIsbnArr] = useState([]);
    const [myListBook, setMyListBook] = useState([]);
    const [genreSelected, setGenreSelected] = useState("Todos");
    const [myListBookState, setMyListBookState] = useState(false);



    function handleLocalStorage() {
        function getMyListBook(e) {
            if (e.key === "myBooks") {
                const booksInList = JSON.parse(localStorage.getItem("myBooks") ?? "[]");
                setMyListBook(booksInList)
                setIsbnArr(booksInList.map((item2) => item2.ISBN))
            }
        }
        window.addEventListener("storage", getMyListBook)
        return () => window.removeEventListener("storage", getMyListBook)
    }

    const addMyListBook = (bookSelected) => {
        const check = isbnArr.find((item) => item == bookSelected.ISBN)
            ? myListBook.filter((book) => book.ISBN != bookSelected.ISBN) : [...myListBook, bookSelected];
        setIsbnArr(check.map((item2) => item2.ISBN))
        setMyListBook(check);
        localStorage.setItem("myBooks", JSON.stringify(check))
    }

    const booksFilter = useMemo(() => {
        if (genreSelected === "Todos") {
            setGenreSelected("Todos")
            return library
        }
        else {
            return library.filter((book) => {
                if (book.book.genre != genreSelected) return false;
                setGenreSelected(book.book.genre)
                return true;
            })

        }


    }, [genreSelected])



    const genreList = library.reduce((acc, item) => {
        if (!acc.includes(item.book.genre)) {
            acc.push(item.book.genre);
        }
        return acc;
    }, [])

    const getNumberGenre = useMemo(() => {
        const genreListNumber = genreList.map((genre) => {
            const genreItem = {
                genre: genre,
                count: 0
            }
            return genreItem
        })
        const arrTest = []
        for (let i = 0; i < genreListNumber.length; i++) {
            for (let a = 0; a < library.length; a++) {
                if (genreListNumber[i].genre == library[a].book.genre) {
                    genreListNumber[i].count = genreListNumber[i].count + 1
                }
            }
            arrTest.push(genreListNumber[i])
        }
        return arrTest;
    }, [])


    useEffect(() => {
        const booksInList = JSON.parse(localStorage.getItem("myBooks") ?? "[]");
        setIsbnArr(booksInList.map((item2) => item2.ISBN))
        setMyListBook(booksInList)

        const listenLocalStorage = handleLocalStorage();
        return () => listenLocalStorage();
    }, [])


    return (
        <div className="h-auto p-4 w-full">
            <h2 className={`text-left text-white text-4xl mb-10 ${paytone_One.className}`} > Books Availables: {booksFilter.length}</h2>
            <div>
                <div>
                    <select className="text-black" value={genreSelected} onChange={(e) => setGenreSelected(e.target.value)}>
                        <option key={1231} value="Todos">{`Todos (${library.length})`}</option>
                        {getNumberGenre.map((genre) => (
                            <option key={genre.genre} className="text-black" value={genre.genre}>{`${genre.genre} (${genre.count})`}</option>
                        ))}
                    </select>
                    <div className="flex justify-end">
                        <button onClick={() => setMyListBookState(true)} className="text-center mb-4 p-2 rounded-md bg-white text-black hover:bg-white/90 transition-all">
                            My books: {myListBook.length}
                        </button>
                    </div>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 h-auto">
                    {booksFilter.map((book) => (
                        <li onClick={() => addMyListBook(book.book)} className={`rounded-md h-full w-full flex flex-col gap-2 relative`} key={book.book.title}>
                            {isbnArr.includes(book.book.ISBN) && <span className="absolute top-2 right-2 bg-black p-2 rounded-md text-sm">Agregado a mi lista</span>}
                            <Image width={1000} height={1000} className="rounded-md w-full h-full object-cover" alt={book.book.title} src={book.book.cover} />
                            <p className={`text-base text-white`}>{book.book.title}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <article>
                <div className={myListBookState ? "fixed top-0 right-0 w-[40%] h-full bg-[#222] transition-all" : "fixed top-0 -right-[40%] w-[40%] h-full bg-[#222] transition-all"}>
                    <span onClick={() => setMyListBookState(false)} className="text-3xl inline-block translate-x-2 cursor-pointer">X</span>
                    <h2 className={`text-left text-white text-4xl mb-10 ${paytone_One.className} text-center`} > My books list</h2>

                </div>
            </article>
        </div>
    )
}