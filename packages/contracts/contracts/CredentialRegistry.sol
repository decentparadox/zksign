// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CredentialRegistry
 * @dev Registry for credential schemas, issuers, and revocations
 */
contract CredentialRegistry is Ownable {
    // Credential types
    enum CredentialType {
        CollegeID,
        CitizenshipCard,
        DriversLicense,
        VehicleRegistration
    }

    // Credential schema
    struct CredentialSchema {
        bytes32 schemaHash;
        CredentialType credType;
        uint256 version;
        uint256 createdAt;
        bool active;
    }

    // Issued credential record
    struct IssuedCredential {
        bytes32 credentialId;
        address issuer;
        address holder;
        CredentialType credType;
        bytes32 commitment; // Poseidon hash commitment
        uint256 issuedAt;
        uint256 expiresAt;
        bool revoked;
    }

    // State variables
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => CredentialSchema) public schemas;
    mapping(bytes32 => IssuedCredential) public credentials;
    mapping(bytes32 => bool) public revokedCredentials;
    
    // Issuer -> credential count
    mapping(address => uint256) public issuerCredentialCount;

    // Events
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event SchemaRegistered(bytes32 indexed schemaHash, CredentialType credType, uint256 version);
    event CredentialIssued(
        bytes32 indexed credentialId,
        address indexed issuer,
        address indexed holder,
        CredentialType credType,
        bytes32 commitment
    );
    event CredentialRevoked(bytes32 indexed credentialId, address indexed issuer);

    constructor() Ownable(msg.sender) {}

    // Modifier to check if caller is authorized issuer
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }

    /**
     * @dev Authorize an issuer
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[issuer], "Already authorized");
        
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    /**
     * @dev Revoke issuer authorization
     */
    function revokeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Not an authorized issuer");
        
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    /**
     * @dev Register a credential schema
     */
    function registerSchema(
        bytes32 schemaHash,
        CredentialType credType,
        uint256 version
    ) external onlyOwner {
        require(schemaHash != bytes32(0), "Invalid schema hash");
        require(!schemas[schemaHash].active, "Schema already registered");

        schemas[schemaHash] = CredentialSchema({
            schemaHash: schemaHash,
            credType: credType,
            version: version,
            createdAt: block.timestamp,
            active: true
        });

        emit SchemaRegistered(schemaHash, credType, version);
    }

    /**
     * @dev Issue a credential (register commitment on-chain)
     */
    function issueCredential(
        bytes32 credentialId,
        address holder,
        CredentialType credType,
        bytes32 commitment,
        uint256 expiresAt
    ) external onlyAuthorizedIssuer {
        require(credentialId != bytes32(0), "Invalid credential ID");
        require(holder != address(0), "Invalid holder address");
        require(commitment != bytes32(0), "Invalid commitment");
        require(expiresAt > block.timestamp, "Invalid expiry date");
        require(credentials[credentialId].credentialId == bytes32(0), "Credential already exists");

        credentials[credentialId] = IssuedCredential({
            credentialId: credentialId,
            issuer: msg.sender,
            holder: holder,
            credType: credType,
            commitment: commitment,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            revoked: false
        });

        issuerCredentialCount[msg.sender]++;

        emit CredentialIssued(credentialId, msg.sender, holder, credType, commitment);
    }

    /**
     * @dev Revoke a credential
     */
    function revokeCredential(bytes32 credentialId) external onlyAuthorizedIssuer {
        IssuedCredential storage cred = credentials[credentialId];
        require(cred.credentialId != bytes32(0), "Credential does not exist");
        require(cred.issuer == msg.sender, "Not the issuer");
        require(!cred.revoked, "Already revoked");

        cred.revoked = true;
        revokedCredentials[credentialId] = true;

        emit CredentialRevoked(credentialId, msg.sender);
    }

    /**
     * @dev Check if credential is valid (not revoked and not expired)
     */
    function isCredentialValid(bytes32 credentialId) external view returns (bool) {
        IssuedCredential storage cred = credentials[credentialId];
        
        if (cred.credentialId == bytes32(0)) return false;
        if (cred.revoked) return false;
        if (block.timestamp > cred.expiresAt) return false;
        
        return true;
    }

    /**
     * @dev Get credential details
     */
    function getCredential(bytes32 credentialId) 
        external 
        view 
        returns (
            address issuer,
            address holder,
            CredentialType credType,
            bytes32 commitment,
            uint256 issuedAt,
            uint256 expiresAt,
            bool revoked
        ) 
    {
        IssuedCredential storage cred = credentials[credentialId];
        require(cred.credentialId != bytes32(0), "Credential does not exist");

        return (
            cred.issuer,
            cred.holder,
            cred.credType,
            cred.commitment,
            cred.issuedAt,
            cred.expiresAt,
            cred.revoked
        );
    }

    /**
     * @dev Check if address is authorized issuer
     */
    function isAuthorizedIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }
}

