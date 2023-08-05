"use client"

import Image from "next/image";
import booksData from "../../../utils/books.json"
import { useEffect, useMemo, useRef, useState } from "react"
import { paytone_One } from "../../../utils/fonts";
import { gsap } from "gsap-trial";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap-trial/all";
import useIntersection from "../hooks/useIntersection";
import { Book } from "./Book";

export default function BooksContainer() {
    const { library } = booksData;
    const booksLibrary = library.map((bookItem) => bookItem.book);

    const app = useRef(null)
    // const books = useRef(null)
    // const bookObserver = useIntersection(books);

    const [isbnArr, setIsbnArr] = useState([]);
    const [myListBook, setMyListBook] = useState([]);
    const [genreSelected, setGenreSelected] = useState("Todos");
    const [genreMyListBookSelected, setGenreMyListBookSelected] = useState("Todos");
    const [myListBookState, setMyListBookState] = useState(false);
    const [searchBook, setSearchBook] = useState("");
    const [searchMyListBook, setSearchMyListBook] = useState("");
    const [bookDetails, setBookDetails] = useState(null)


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
        if (!myListBookState) {
            setSearchBook(e.target.value);
        }
        else {
            setSearchMyListBook(e.target.value)
        }
    };

    function filterByGenre(books) {
        if (!myListBookState) {
            return books.filter((item) => {
                if (item.title.toString().toLowerCase().includes(searchBook.toLowerCase())) {
                    return item;
                }
            });
        }
        else {
            return books.filter((item) => {
                if (item.title.toString().toLowerCase().includes(searchMyListBook.toLowerCase())) {
                    return item;
                }
            });
        }
    }

    const booksFilter = useMemo(() => {
        if (genreSelected === "Todos") {
            setGenreSelected("Todos")
            return filterByGenre(booksLibrary);

        }
        else {
            const genreFilter = booksLibrary.filter((book) => {
                if (book.genre != genreSelected) return false;
                setGenreSelected(book.genre)
                return true;
            })
            return filterByGenre(genreFilter)
        }

    }, [genreSelected, searchBook])

    const myListBookFilter = useMemo(() => {
        if (genreMyListBookSelected === "Todos") {
            console.log(genreMyListBookSelected)
            setGenreMyListBookSelected("Todos")
            return filterByGenre(myListBook);
        }
        else {
            const genreFilter = myListBook.filter((book) => {
                if (book.genre != genreMyListBookSelected) {
                    return false;
                }
                setGenreMyListBookSelected(book.genre)
                return true;
            })
            return filterByGenre(genreFilter)

        }

    }, [genreMyListBookSelected, searchMyListBook, myListBookState, myListBook])



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

    const genreSelectedCount = genreSelected != "Todos" ? getNumberGenre.find(item => item.genre == genreSelected) : null;

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

        // booksElements.forEach((element) => {
        //     gsap.fromTo(element, {
        //         scrollTrigger: {
        //             trigger: element,
        //             markers: true,
        //             start: "start 70%",
        //             end: "start 70%",


        //         },
        //         opacity: 0,
        //         duration: .5,
        //     },
        //         {
        //             scrollTrigger: {
        //                 trigger: element,
        //                 markers: true,
        //                 start: "start 70%",
        //                 end: "start 70%",
        //             },
        //             opacity: 1,
        //             duration: .5,
        //         })
        // })
        // tl.fromTo("li", { opacity: 0, duration: .5, stagger: 0.05 }, { opacity: 1, duration: .5, stagger: 0.05 }, "-=.4")
    }, [])



    return (
        <div ref={app} className={`h-auto p-4 w-full overflow-hidden`}>
            <h1 className={`title text-white text-6xl text-center mb-4 ${paytone_One.className} z-20`}>Books Store</h1>

            <section className="">
                <div className="books-options">
                    <div className="h-auto p-2 w-full flex justify-center items-center">
                        <h2 className="w-full max-w-xl text-center text-2xl text-white/70">Descubre tesoros literarios en nuestra librería: una ventana a la imaginación y el conocimiento, donde cada página te invita a soñar y aprender.</h2>
                    </div>
                    <div className="sticky top-0 left-0 bg-red-300 h-auto">
                        <h3 className={`text-left text-white text-4xl mb-10 ${paytone_One.className}`} > Books Availables: {booksLibrary.length - myListBook.length}</h3>
                        {genreSelected != "Todos" &&
                            <h3 className={`text-left text-white text-4xl mb-10 ${paytone_One.className}`} > {genreSelected}: {genreSelectedCount.count}</h3>
                        }
                        <div className="flex justify-between mb-4">
                            <select className="text-black p-2 h-10 rounded-md font-bold outline-none shadow-lg shadow-white/30 hover:bg-[#ddd] transition-all" value={genreSelected} onChange={(e) => setGenreSelected(e.target.value)}>
                                <option key={1231} value="Todos">{`Todos (${booksLibrary.length})`}</option>
                                {getNumberGenre.map((genre) => (
                                    <option key={genre.genre} className="text-black" value={genre.genre}>{`${genre.genre} (${genre.count})`}</option>
                                ))}
                            </select>
                            <button onClick={() => setMyListBookState(true)} className="shadow-lg shadow-white/30 text-center mb-4 p-2 font-bold rounded-md bg-white text-black hover:bg-white/90 transition-all">
                                My books: {myListBook.length}
                            </button>
                        </div>
                        <div className="flex w-72 items-center justify-center rounded-md border border-white/20 mb-4">
                            <input
                                onChange={handleSearch}
                                value={searchBook}
                                placeholder="¿Qué libro estás buscando?"
                                className="h-full w-full rounded-r-md p-1 text-left font-bold text-white outline-none bg-transparent"
                            />
                        </div>
                    </div>

                </div>
                <ul className="flex flex-col gap-4 h-auto items-center justify-center relative">
                    {booksFilter.map((book) => (
                        <Book isbnArr={isbnArr} book={book} addMyListBook={addMyListBook} />
                    ))}
                </ul>
            </section>
            <article>
                <div className={myListBookState ? "fixed top-0 right-0 w-full sm:w-[600px] h-full bg-[#222] transition-all overflow-y-scroll px-4" : "fixed top-0 -right-[100%] w-full sm:w-[600px] h-full bg-[#222] transition-all px-4"}>
                    <span onClick={() => setMyListBookState(false)} className="text-3xl inline-block translate-x-2 cursor-pointer">X</span>
                    <h3 className={`text-left text-white text-4xl mb-10 ${paytone_One.className} text-center`} > My books list</h3>
                    <div className="flex gap-4 justify-between items-center">
                        <div className="flex w-72 h-full items-center justify-center rounded-md border border-white/20">
                            <input
                                onChange={handleSearch}
                                value={searchMyListBook}
                                placeholder="¿Qué libro estás buscando?"
                                className="h-full w-full rounded-r-md p-2 text-left font-bold text-white outline-none bg-transparent"
                            />
                        </div>
                        <select className="text-black p-2 h-10 rounded-md font-bold outline-none shadow-lg shadow-white/30 hover:bg-[#ddd] transition-all" value={genreMyListBookSelected} onChange={(e) => setGenreMyListBookSelected(e.target.value)}>
                            <option key={1231} value="Todos">{`Todos (${myListBookFilter.length})`}</option>
                            {getNumberGenre.map((genre) => (
                                <option key={genre.genre} className="text-black" value={genre.genre}>{`${genre.genre} (${genre.count})`}</option>
                            ))}
                        </select>
                    </div>
                    {myListBook.length == 0 ?
                        <p className={`text-center text-2xl ${paytone_One.className}`}>No hay libros en tu lista</p>

                        :
                        <ul className="grid sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 h-auto p-4">
                            {myListBookFilter.map((book) => (
                                <li onClick={() => addMyListBook(book)} className={`rounded-md h-full w-full flex flex-col gap-2 relative bg-black`} key={book.title}>
                                    {isbnArr.includes(book.ISBN) && <span className="absolute top-2 right-2 bg-black p-2 rounded-md text-sm">Quitar de mi lista</span>}
                                    <Image width={1000} height={1000} className="rounded-t-md w-full h-full object-cover" alt={book.title} src={book.cover} />
                                    <div className="p-2 flex flex-col gap-2 h-80">
                                        <p className={`text-white text-xl font-semibold`}>{book.title}</p>
                                        <p className="text-white/70">{book.synopsis}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </article>
        </div>
    )
}