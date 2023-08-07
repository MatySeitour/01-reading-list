import { useEffect, useState } from "react"
import { gsap } from "gsap-trial"
import { ScrollTrigger } from "gsap-trial/all"
import Image from "next/image"


export function Book({ addMyListBook, isbnArr, book, genreSelected, myListBookState, searchBook }) {

    const [loadBookState, setLoadBookState] = useState(false);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        setLoadBookState(true);
        setTimeout(() => {
            setLoadBookState(false);
        }, 500)

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: `.book-${book.ISBN}`,
                // markers: true,
                start: "start 90%",
                end: "start 90%",
            }
        })

        const booksElements = gsap.utils.toArray(`.book-info__${book.ISBN} p`)

        tl2.fromTo(`.book-${book.ISBN}`, {
            opacity: 0,
            duration: .5,
        },
            {
                opacity: 1,
                duration: .5,
            })

        booksElements.forEach((element) => {
            tl2.fromTo(element, {
                opacity: 0,
                yPercent: -10,
                duration: .2,
            },
                {
                    opacity: 1,
                    yPercent: -0,
                    duration: .2,
                }, "-=.18")
        })
    }, [genreSelected, myListBookState, searchBook])

    return (
        <>
            {loadBookState ?
                <>
                    <li
                        className={`rounded-md h-auto book w-full max-w-5xl flex flex-row justify-between relative book-${book.ISBN} border border-white/30`}>
                        <div className="w-72 bg-white/10"></div>
                        <div className={`p-2 flex flex-col gap-4 h-full w-full book-info__${book.ISBN}`}>
                            <div className="flex-col gap-4 flex">
                                <div className={`bg-white/10 w-40 h-10`}></div>
                                <div className="bg-white/10 w-64 h-10"></div>
                                <div className={`bg-white/10 w-40 h-10`}></div>
                                <div className="bg-white/10 w-64 h-10"></div>
                                <div className={`bg-white/10 w-40 h-10`}></div>
                                <div className="bg-white/10 w-64 h-10"></div>
                            </div>
                        </div>
                    </li>
                </>
                :
                <li
                    className={`rounded-md h-auto book w-full max-w-5xl flex flex-row justify-between relative book-${book.ISBN} border border-white/30`}>
                    <button onClick={() => addMyListBook(book)} className={isbnArr.includes(book.ISBN) ? "cursor-pointer absolute top-2 right-2 bg-white text-black p-2 rounded-md text-sm scale-100 transition-all font-medium" : "scale-100 cursor-pointer transition-all absolute top-2 right-2 bg-white text-black p-2 rounded-md text-sm font-medium"} >{isbnArr.includes(book.ISBN) ? "✔️ Agregado a mi lista" : "Agregar a mi lista"}</button>
                    <div className="w-72">
                        <Image width={1000} height={1000} className="rounded-l-md w-full h-full object-cover" alt={book.title} src={book.cover} />
                    </div>
                    <div className={`p-2 flex flex-col gap-4 h-full w-full book-info__${book.ISBN}`}>
                        <div className="flex-col gap-4 flex">
                            <p className={`text-white text-xl font-semibold book-title`}>{book.title}</p>
                            <p className="text-white/70 book-synopsis max-w-sm">{book.synopsis}</p>
                            <p className="book-genre text-white/70"><span className="text-white">Género:</span> {book.genre}</p>
                            <p className="book-date text-white/70"><span className="text-white">Fecha de publicación:</span> {book.year}</p>

                        </div>
                        <div className="flex flex-col text-left gap-2">
                            <p className="book-author text-white/70"><span className="text-white">Autor/a:</span> {book.author.name}</p>
                            {
                                book.author.otherBooks.length != 0 &&
                                <>
                                    <p>Otros libros</p>
                                    <ul className="">
                                        {book.author.otherBooks.map((otherBook) => (
                                            <li key={otherBook} className="text-sm text-white/70">{otherBook}</li>
                                        ))}
                                    </ul>

                                </>
                            }
                            <p className="text-white/70"><span className="text-white">Número de páginas:</span> {book.pages}</p>

                        </div>
                    </div>
                </li>

            }
        </>

    )
}