import { Application, Router } from "https://deno.land/x/oak@v6.3.0/mod.ts";

interface BookInterface {
    id: number;
    title: string;
    author: string;
}
class Book implements BookInterface {
    id: number;
    title: string;
    author: string;
    constructor(id: number, title: string, author: string) {
        this.id = id;
        this.title = title;
        this.author = author;
    }
}
const books = new Map<number, Book>();
books.set(1, {
    id: 1,
    title: "The Hound of the Baskervilles",
    author: "Conan Doyle, Arthur",
});

const router = new Router();
router
    .get("/", (context) => {
        context.response.body = "Hello world! WIP. For now: item list, single item, and add on on /book";
    })
    .get("/book", (context) => {
        context.response.body = Array.from(books.values());
    })
    .get("/book/:id", (context) => {
        if (context.params && context.params.id && books.has(+context.params.id)) {
            context.response.body = books.get(+context.params.id);
        }
    })
    .post("/book", async (context) => {
        const result = context.request.body();
        if (result.type === "json") {
            const value = await result.value; // an object of parsed JSON
            if (!value.author || !value.title) {
                context.response.body = "Need to provide both author and title to create book!";
                context.response.status = 422;
                return;
            }
            const index: number = books.size + 1;
            const book: Book = new Book(index, value.title, value.author);
            books.set(index, book);
            context.response.body = book;
            context.response.status = 201;
        } else {
            context.response.body = "Only json data";
            context.response.status = 422;
        }
    });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
