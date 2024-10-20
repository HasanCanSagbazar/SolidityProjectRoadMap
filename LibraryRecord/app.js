import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

const contractAddress = '0x197109b5C2E7825473E6288FF23E4dc5EC781BE0';
const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "title",
          "type": "string"
        }
      ],
      "name": "BookAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "BookBorrowed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "BookReturned",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "activeBook",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "nextBookId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        }
      ],
      "name": "addBook",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "bookCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "bookRecord",
      "outputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "enum LibraryRecord.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "booksByTitle",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "borrowBook",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "returnBook",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "searchBook",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "enum LibraryRecord.Status",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        }
      ],
      "name": "searchBookWithTitle",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
}

// Add Book
document.getElementById("addBookButton").addEventListener("click", async () => {
	const bookId = document.getElementById("bookId").value;
    const author = document.getElementById("author").value;
    const title = document.getElementById("title").value;

    try {
        const contract = await getContract();
        const tx = await contract.addBook(bookId, author, title);
        await tx.wait(); 
        alert("Book added!");
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book: " + error.message);
    }
});

// Borrow Book
document.getElementById("borrowBookButton").addEventListener("click", async () => {
    const bookId = document.getElementById("bookIdBorrow").value.trim(); 
    const borrower = document.getElementById("borrower").value.trim();

    
    if (!ethers.isAddress(borrower)) {
        alert("Invalid borrower address.");
        return;
    }

   
    if (!bookId) {
        alert("Book ID cannot be empty.");
        return;
    }

    try {
        const contract = await getContract();
        const tx = await contract.borrowBook(bookId, borrower); 
        await tx.wait(); 
        alert("Book borrowed successfully!");
    } catch (error) {
        console.error("Error borrowing book:", error);
        alert("Failed to borrow book: " + error.message);
    }
});

// Return Book
document.getElementById("returnBookButton").addEventListener("click", async () => {
    const bookId = document.getElementById("bookIdReturn").value;

    try {
        const contract = await getContract();
        const tx = await contract.returnBook(bookId);
        await tx.wait(); 
        alert("Book returned!");
    } catch (error) {
        console.error("Error returning book:", error);
        alert("Failed to return book: " + error.message);
    }
});

const statusEnum = ["LOANED", "AVAILABLE"];
// Search Book
document.getElementById("searchBookButton").addEventListener("click", async () => {
	const bookId = document.getElementById("bookIdSearch").value;

    try {
        const contract = await getContract();
        const bookData = await contract.searchBook(bookId);

        
        const author = bookData[0];
        const title = bookData[1];
        const status = bookData[2];
        const borrower = bookData[3];

        const statusText = statusEnum[status]; 

       
        const resultsDiv = document.getElementById("searchResults");
        resultsDiv.innerHTML = `
            <p><strong>Author:</strong> ${author}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Status:</strong> ${statusText}</p>
            <p><strong>Borrower:</strong> ${borrower}</p>
        `;
    } catch (error) {
        console.error("Error searching for book:", error);
        alert("Failed to search for book: " + error.message);
    }
});
