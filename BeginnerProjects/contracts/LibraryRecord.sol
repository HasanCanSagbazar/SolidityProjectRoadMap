// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract LibraryRecord {
    address private owner;
    uint256 private nextBookId;

    enum Status {
        LOANED,
        AVAILABLE
    }

    struct Book {
        uint256 id;
        string author;
        string title;
        Status status;
        address borrower;
    }

    mapping(string => uint256) public bookCount;
    mapping(string => uint256) public activeBook;
    mapping(uint256 => Book) public bookRecord;
    mapping(string => uint256[]) public booksByTitle;

    
    event BookAdded(uint256 indexed id, string indexed author, string indexed title);
    event BookBorrowed(uint256 indexed id, address indexed borrower);
    event BookReturned(uint256 indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextBookId = 0;
    }

    function addBook(string memory author, string memory title) external onlyOwner returns (uint256) {
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

        nextBookId += 1;
        return nextBookId;
    }

    function searchBook(uint256 id) external view returns (string memory, string memory, Status) {
        return (bookRecord[id].author, bookRecord[id].title, bookRecord[id].status);
    }

    function searchBookWithTitle(string memory title) external view returns (uint256[] memory) {
        require(booksByTitle[title].length > 0, "Searching book is not found");
        return booksByTitle[title];
    }

    function borrowBook(uint256 id, address borrower) external {
        require(bookRecord[id].status == Status.AVAILABLE, "The book is borrowed");

        string memory title = bookRecord[id].title;
        activeBook[title] -= 1;

        bookRecord[id].status = Status.LOANED;
        bookRecord[id].borrower = borrower;

        emit BookBorrowed(id, borrower); 
    }

    function returnBook(uint256 id) external {
        require(bookRecord[id].status == Status.LOANED, "The book is not borrowed");

        string memory title = bookRecord[id].title;
        activeBook[title] += 1;

        bookRecord[id].status = Status.AVAILABLE;
        bookRecord[id].borrower = address(0);

        emit BookReturned(id); 
    }
}
