// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

 contract NFTMarketPlace is ERC721{
    uint256 public _tokenIds;

    address payable private owner;

    struct NFT{
        uint256 id;
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => NFT) public _nfts;

    event NFTListed(address indexed seller, uint256 indexed tokenId, uint256 price);
    event NFTSold(uint256 indexed tokenId, uint256 price, address indexed buyer, address indexed seller);
    event NFTMinted(uint256 indexed tokenId, address indexed to);


    constructor() ERC721("NFTMarketplace", "NFTM"){
        owner = payable(msg.sender);
    }

    function mintNFT(address to) public returns(uint256){
        _mint(to, _tokenIds);
        _tokenIds += 1;
        
        emit NFTMinted(_tokenIds, to);
        return _tokenIds;
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) != address(0), "Token ID does not exist");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");
        require(price > 0, "Price must be greater than zero");

        _nfts[tokenId] = NFT(tokenId, msg.sender, price, true);

        emit NFTListed(msg.sender, tokenId, price);
    }

    function buyNFT(uint256 tokenId) external payable{
        require(_nfts[tokenId].isActive, "This NFT is not listed for sale");
        require(msg.value >= _nfts[tokenId].price, "Insufficient payment");

        address payable seller = payable(_nfts[tokenId].seller);
        uint256 price = _nfts[tokenId].price;
        (bool success, ) = seller.call{value: price}("");

        require(success, "Transfer failed");

        _transfer(seller, msg.sender, tokenId);
        _nfts[tokenId].isActive = false;
        emit NFTSold(tokenId, _nfts[tokenId].price, msg.sender, seller);
    }

    function inquireByTokenId(uint256 tokenId) external view returns (uint256 price, address seller, bool isActive) {
        NFT memory nft = _nfts[tokenId];
        return (nft.price, nft.seller, nft.isActive);
    }
}