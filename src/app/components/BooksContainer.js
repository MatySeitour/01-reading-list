"use client"

import booksData from "../../../utils/books.json"
import { useEffect, useMemo, useState } from "react"
import { paytone_One } from "../../../utils/fonts";
import { gsap } from "gsap-trial";
import SplitType from "split-type";
import { Book } from "./Book";

export default function BooksContainer() {
    const { library } = booksData;
    const booksLibrary = library.map((bookItem) => bookItem.book);

    const [isbnArr, setIsbnArr] = useState([]);
    const [myListBook, setMyListBook] = useState([]);
    const [genreSelected, setGenreSelected] = useState("Todos");
    const [genreMyListBookSelected, setGenreMyListBookSelected] = useState("Todos");
    const [myListBookState, setMyListBookState] = useState(false);
    const [searchBook, setSearchBook] = useState("");
    const [pagesFilter, setPagesFilter] = useState(1400)


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
        const check = myListBook.find((item) => item.ISBN == bookSelected.ISBN)
            ? myListBook.filter((book) => book.ISBN != bookSelected.ISBN) : [...myListBook, bookSelected];
        setIsbnArr(check.map((item2) => item2.ISBN))
        setMyListBook(check);
        localStorage.setItem("myBooks", JSON.stringify(check))
    }

    const handleSearch = (e) => {
        setSearchBook(e.target.value);
    };
    const handlePageFilter = (e) => {
        setPagesFilter(e.target.value);
    };

    function filterByGenre(books) {
        return books.filter((item) => {
            if (item.title.toString().toLowerCase().includes(searchBook.toLowerCase()) && item.pages <= pagesFilter) {
                return item;
            }
        });
    }

    const booksFilter = useMemo(() => {
        window.scrollTo(0, 0)
        if (genreSelected === "Todos") {
            setGenreSelected("Todos")
            return filterByGenre(booksLibrary);

        }
        else {
            const genreFilter = booksLibrary.filter((book) => {
                if (book.genre != genreSelected && book.pages > pagesFilter) return false;
                setGenreSelected(book.genre)
                return true;
            })
            return filterByGenre(genreFilter)
        }

    }, [genreSelected, searchBook, pagesFilter])

    const myListBookFilter = useMemo(() => {
        if (genreMyListBookSelected === "Todos") {
            setGenreMyListBookSelected("Todos")
            return filterByGenre(myListBook);
        }
        else {
            const genreFilter = myListBook.filter((book) => {
                if (book.genre != genreMyListBookSelected) return false;
                setGenreMyListBookSelected(book.genre)
                return true;
            })
            return filterByGenre(genreFilter)

        }

    }, [genreMyListBookSelected, myListBookState, myListBook, searchBook])


    const genreList = booksLibrary.reduce((acc, item) => {
        if (!acc.includes(item.genre)) {
            acc.push(item.genre);
        }
        return acc;
    }, [])

    const getNumberGenre = useMemo(() => {
        const isMyList = myListBookState ? myListBook : booksLibrary;
        const genreListNumber = genreList.map((genre) => {
            const genreItem = {
                genre: genre,
                count: 0
            }
            return genreItem
        })
        const arrTest = []
        console.log(isMyList)
        for (let i = 0; i < genreListNumber.length; i++) {
            for (let a = 0; a < isMyList.length; a++) {
                if (genreListNumber[i].genre == isMyList[a].genre) {
                    genreListNumber[i].count = genreListNumber[i].count + 1
                }
            }
            arrTest.push(genreListNumber[i])
        }
        return arrTest;
    }, [myListBookState])

    useEffect(() => {
        const booksInList = JSON.parse(localStorage.getItem("myBooks") ?? "[]");
        setIsbnArr(booksInList.map((item2) => item2.ISBN))
        setMyListBook(booksInList)

        const listenLocalStorage = handleLocalStorage();
        return () => listenLocalStorage();
    }, [])

    useEffect(() => {
        let title = new SplitType(".title");
        let chars = title;


        const tl = gsap.timeline({ paused: true });

        tl.play();

        tl.from(".char", {
            yPercent: 130,
            stagger: 0.04,
        })

        tl.fromTo("h1", { ease: "power3.inOut", yPercent: 150, duration: 1, scale: 2 }, { ease: "power3.inOut", yPercent: 0, duration: 1, scale: 1 }, "-=.5")
        tl.fromTo(".books-options", { opacity: 0, duration: .5 }, { opacity: 1, duration: .5 }, "-=.4")

    }, [])

    return (
        <div className={`h-auto p-4 w-full max-w-7xl mx-auto`}>
            <div className="flex justify-center">
                <h1 className={`title text-white text-6xl text-center mb-4 ${paytone_One.className} max-w-sm`}>Books Store</h1>
            </div>

            <section className="books-options">
                <div className="h-auto p-2 w-full flex justify-center items-center mb-10">
                    <h2 className="w-full max-w-xl text-center text-2xl text-white/70">Descubre tesoros literarios en nuestra librería: una ventana a la imaginación y el conocimiento, donde cada página te invita a soñar y aprender.</h2>
                </div>
                <h3 className={` text-left text-white text-4xl mb-10 ${paytone_One.className}`} > Books Availables: {booksLibrary.length - myListBook.length}</h3>
                <nav className="sticky top-4 z-10 mb-10 bg-[#222a] backdrop-blur-sm p-2 flex items-center justify-between rounded-md">
                    <div className="flex justify-between gap-4 w-full">
                        <select className="text-black p-2 h-10 rounded-md font-bold outline-none  hover:bg-[#ddd] transition-all" value={genreSelected} onChange={(e) => {
                            setGenreMyListBookSelected(e.target.value);
                            setGenreSelected(e.target.value);
                        }}>
                            <option key={1231} value="Todos">{`Todos (${booksLibrary.length})`}</option>
                            {getNumberGenre.map((genre) => (
                                <option key={genre.genre} className="text-black" value={genre.genre}>{`${genre.genre} (${genre.count})`}</option>
                            ))}
                        </select>
                        <div>
                            <input onChange={handlePageFilter} className="text-white bg-white" type="range" min={0} max={1400} value={pagesFilter} />
                            <output>{pagesFilter}</output>
                        </div>
                        <div className="flex w-96 items-center h-10 justify-center rounded-md border border-white/20 focus-within:border-white">
                            <input
                                onChange={handleSearch}
                                value={searchBook}
                                placeholder="¿Qué libro estás buscando?"
                                className="h-full w-full rounded-r-md p-1 text-left font-bold text-white outline-none bg-transparent"
                            />
                        </div>
                        <button onClick={() => setMyListBookState(prev => !prev)} className="h-10 text-center p-2 font-bold rounded-md bg-white text-black hover:bg-white/90 transition-all">
                            My books: {myListBook.length}
                        </button>
                    </div>
                </nav>
                <ul className="flex flex-col gap-8 h-auto items-center justify-center relative">
                    {!myListBookState ? booksFilter.map((book) => (
                        <Book isbnArr={isbnArr} book={book} addMyListBook={addMyListBook} key={book.ISBN} genreSelected={genreSelected} myListBookState={myListBookState} searchBook={searchBook} />
                    ))
                        :

                        myListBookFilter.map((book) => (
                            <Book isbnArr={isbnArr} book={book} addMyListBook={addMyListBook} key={book.ISBN} genreSelected={genreSelected} myListBookState={myListBookState} searchBook={searchBook} />
                        ))
                    }
                </ul>
            </section >
        </div >
    )
}