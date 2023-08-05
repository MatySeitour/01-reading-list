import { useEffect } from "react"
import { gsap } from "gsap-trial"
import { ScrollTrigger } from "gsap-trial/all"
import Image from "next/image"


export function Book({ addMyListBook, isbnArr, book }) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: `.book-${book.ISBN}`,
                markers: true,
                start: "top center",
                end: "start 70%",
            }
        })

        const booksElements = gsap.utils.toArray(`.book-info__${book.ISBN} p`)
        console.log(booksElements)


        // booksElements.forEach((element) => {
        tl2.fromTo(`.book-${book.ISBN}`, {
            opacity: 0,
            duration: .5,
        },
            {
                opacity: 1,
                duration: .5,
            })

        // tl2.fromTo(`.book-${book.ISBN} p`, {
        //     opacity: 0,
        //     duration: .5,
        // },
        //     {
        //         opacity: 1,
        //         duration: .5,
        //     })

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
                })
        })
    }, [])

    return (
        <li
            onClick={() => addMyListBook(book)}
            className={`rounded-md h-auto book max-h-[18rem] w-full max-w-5xl flex flex-row justify-between relative book-${book.ISBN}`} key={book.title}>
            {isbnArr.includes(book.ISBN) && <span className="absolute top-2 right-2 bg-black p-2 rounded-md text-sm">Agregado a mi lista</span>}
            <Image width={1000} height={1000} className="w-56 min-w-[10rem] h-full object-cover" alt={book.title} src={book.cover} />
            <div className={`p-2 flex flex-col gap-2 h-full w-full book-info__${book.ISBN}`}>
                <p className={`text-white text-xl font-semibold book-title`}>{book.title}</p>
                <p className="text-white/70 book-synopsis">{book.synopsis}</p>
                {/* <div className="flex flex-col"> */}
                <p className="book-genre">{book.genre}</p>
                <p className="book-date">Fecha de publicación: {book.year}</p>
                {/* </div> */}
                {/* <div className="w-auto"> */}
                {/* <div className="flex "> */}
                <p className="book-author">Autor/a: {book.author.name}</p>
                {/* </div> */}
                <ul className="">
                    <li>Otros libros</li>
                    {book.author.otherBooks.map((otherBook) => (
                        <li className="text-sm">{otherBook}</li>
                    ))}
                </ul>
                <p>Número de páginas: {book.pages}</p>
                {/* </div> */}
            </div>
        </li>
    )
}