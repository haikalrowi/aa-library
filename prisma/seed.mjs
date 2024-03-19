import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const students = new Array(10).fill(null).map(generateRandomStudent);
const books = new Array(20).fill(null).map(generateRandomBook);

function generateRandomStudent() {
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomModifier = Math.random() * (firstNames.length + lastNames.length);

  return {
    email: `${randomFirstName.toLowerCase()}${randomLastName.toLowerCase()}.${randomModifier}@example.com`,
    username: `${randomFirstName.toLowerCase()}${randomLastName.toLowerCase()}${randomModifier}`,
    password: `${randomFirstName}${randomLastName}`
      .split("")
      .sort(() => 0.5 - Math.random())
      .join(""),
    name: `${randomFirstName} ${randomLastName}`,
  };
}

function generateRandomBook() {
  const titles = [
    "The Art of War",
    "The Catcher in the Rye",
    "The Great Gatsby",
    "To Kill a Mockingbird",
    "1984",
    "Pride and Prejudice",
    "The Hobbit",
    "Lord of the Flies",
    "Brave New World",
    "Animal Farm",
    "The Adventures of Huckleberry Finn",
    "The Grapes of Wrath",
    "Frankenstein",
    "Moby-Dick",
    "Jane Eyre",
    "Wuthering Heights",
    "The Scarlet Letter",
    "Crime and Punishment",
    "War and Peace",
    "One Hundred Years of Solitude",
    "Anna Karenina",
    "The Bell Jar",
    "The Lord of the Rings",
    "The Odyssey",
    "The Iliad",
    "The Divine Comedy",
    "Don Quixote",
    "The Adventures of Sherlock Holmes",
    "Dracula",
    "The Count of Monte Cristo",
    "The War of the Worlds",
    "Alice's Adventures in Wonderland",
    "Gulliver's Travels",
    "The Canterbury Tales",
    "The Wind in the Willows",
    "The Secret Garden",
    "Anne of Green Gables",
    "A Tale of Two Cities",
    "Great Expectations",
    "Oliver Twist",
    "Sense and Sensibility",
    "Little Women",
    "Treasure Island",
    "Around the World in Eighty Days",
    "The Time Machine",
    "The Adventures of Tom Sawyer",
    "Robinson Crusoe",
  ];

  const authors = [
    "Sun Tzu",
    "J.D. Salinger",
    "F. Scott Fitzgerald",
    "Harper Lee",
    "George Orwell",
    "Jane Austen",
    "J.R.R. Tolkien",
    "William Golding",
    "Aldous Huxley",
    "George Orwell",
    "Mark Twain",
    "John Steinbeck",
    "Mary Shelley",
    "Herman Melville",
    "Charlotte Brontë",
    "Emily Brontë",
    "Nathaniel Hawthorne",
    "Fyodor Dostoevsky",
    "Leo Tolstoy",
    "Gabriel García Márquez",
    "Leo Tolstoy",
    "Sylvia Plath",
    "J.R.R. Tolkien",
    "Homer",
    "Homer",
    "Dante Alighieri",
    "Miguel de Cervantes",
    "Arthur Conan Doyle",
    "Bram Stoker",
    "Alexandre Dumas",
    "H.G. Wells",
    "Lewis Carroll",
    "Jonathan Swift",
    "Geoffrey Chaucer",
    "Kenneth Grahame",
    "Frances Hodgson Burnett",
    "L.M. Montgomery",
    "Charles Dickens",
    "Charles Dickens",
    "Charles Dickens",
    "Jane Austen",
    "Louisa May Alcott",
    "Robert Louis Stevenson",
    "Jules Verne",
    "H.G. Wells",
    "Mark Twain",
    "Daniel Defoe",
  ];

  function generateISBN() {
    let isbn = "978";
    for (let i = 0; i < 10; i++) {
      isbn += Math.floor(Math.random() * 10);
    }
    return isbn;
  }

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    author: authors[Math.floor(Math.random() * authors.length)],
    isbn: parseInt(generateISBN()),
  };
}

async function main() {
  for (const book of books) {
    await prisma.book.create({
      data: {
        ...book,
        Copy: { create: [{ serial: `s-${Math.random()}` }] },
      },
    });
  }
  for (const student of students) {
    await prisma.student.create({ data: { ...student } });
  }
}

main()
  .then(async () => {
    const admin = await prisma.admin.create({
      data: {
        email: "admin@localhost",
        username: "admin",
        password: "admin",
      },
    });
    console.log(admin);
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
