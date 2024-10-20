// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract LibraryRecord {
    address private owner;

    enum Status {
        LOANED,
        AVAILABLE
    }

    struct Book {
        string id;
        string author;
        string title;
        Status status;
        address borrower;
    }

    mapping(string => uint256) public bookCount;
    mapping(string => uint256) public activeBook;
    mapping(string => Book) public bookRecord;
    mapping(string => string[]) public booksByTitle;

    
    event BookAdded(string indexed id, string indexed author, string indexed title);
    event BookBorrowed(string indexed id, address indexed borrower);
    event BookReturned(string indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    constructor() {
        owner = msg.sender;
        
    }

    function addBook(string memory nextBookId, string memory author, string memory title) external returns (string memory) {
        bookRecord[nextBookId] = Book({
            id: nextBookId,
            author: author,
            title: title,
            status: Status.AVAILABLE,
            borrower: address(0)
        });

        bookCount[title] += 1;
        activeBook[title] += 1;
        booksByTitle[title].push(nextBookId);

        emit BookAdded(nextBookId, author, title); 

        return nextBookId;
    }

    function searchBook(string memory id) external view returns (string memory, string memory, Status , address) {
        return (bookRecord[id].author, bookRecord[id].title, bookRecord[id].status, bookRecord[id].borrower);
    }

    function searchBookWithTitle(string memory title) external view returns (string[] memory) {
        require(booksByTitle[title].length > 0, "Searching book is not found");
        return booksByTitle[title];
    }

    function borrowBook(string memory id, address borrower) external {
        require(bookRecord[id].status == Status.AVAILABLE, "The book is borrowed");

        string memory title = bookRecord[id].title;
        activeBook[title] -= 1;

        bookRecord[id].status = Status.LOANED;
        bookRecord[id].borrower = borrower;

        emit BookBorrowed(id, borrower); 
    }

    function returnBook(string memory id) external {
        require(bookRecord[id].status == Status.LOANED, "The book is not borrowed");

        string memory title = bookRecord[id].title;
        activeBook[title] += 1;

        bookRecord[id].status = Status.AVAILABLE;
        bookRecord[id].borrower = address(0);

        emit BookReturned(id); 
    }
}
