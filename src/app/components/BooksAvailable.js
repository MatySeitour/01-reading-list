"use client"

export const BooksAvailable = ({ booksLength }) => {

    return (
        <h2 className="text-center text-white text-4xl mb-10" > Libros Disponibles: {booksLength}</h2>
    )
}