// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CredentialRegistry.sol";

/**
 * @title VehicleRegistrationVerifier
 * @dev On-chain ZK proof verification for Vehicle Registration credentials
 */
contract VehicleRegistrationVerifier {
    CredentialRegistry public registry;

    event ProofVerified(
        bytes32 indexed credentialId,
        address indexed verifier,
        bool isValid,
        uint256 timestamp
    );

    constructor(address _registry) {
        require(_registry != address(0), "Invalid registry address");
        registry = CredentialRegistry(_registry);
    }

    /**
     * @dev Verify Vehicle Registration ZK proof on-chain
     */
    function verifyVehicleRegistration(
        bytes calldata proof,
        uint256[] calldata publicInputs,
        bytes32 credentialId
    ) external returns (bool) {
        // 1. Check credential validity
        require(registry.isCredentialValid(credentialId), "Credential invalid or revoked");

        // 2. Verify proof format
        require(proof.length > 0, "Invalid proof");
        require(publicInputs.length >= 5, "Invalid public inputs");

        // 3. Verify credential ID
        bytes32 inputCredentialId = bytes32(publicInputs[0]);
        require(inputCredentialId == credentialId, "Credential ID mismatch");

        // 4. Get credential from registry
        (
            ,
            ,
            ,
            bytes32 commitment,
            ,
            ,
            bool revoked
        ) = registry.getCredential(credentialId);

        require(!revoked, "Credential revoked");

        // 5. Verify commitment
        bytes32 inputCommitment = bytes32(publicInputs[1]);
        require(inputCommitment == commitment, "Commitment mismatch");

        // 6. Verify ZK proof
        bool proofValid = _verifyProof(proof, publicInputs);
        require(proofValid, "Proof verification failed");

        // 7. Verify predicates
        if (publicInputs.length > 5) {
            _verifyPredicates(publicInputs);
        }

        emit ProofVerified(credentialId, msg.sender, true, block.timestamp);
        return true;
    }

    function _verifyProof(bytes calldata proof, uint256[] calldata publicInputs) 
        internal 
        pure 
        returns (bool) 
    {
        // Placeholder - would call Noir verifier in production
        return proof.length > 0 && publicInputs.length > 0;
    }

    function _verifyPredicates(uint256[] calldata publicInputs) internal pure {
        // publicInputs[5] = registration_valid
        // publicInputs[6] = insurance_valid
        // publicInputs[7] = year_range_check
        // publicInputs[8] = min_year
        // publicInputs[9] = max_year
        // publicInputs[10] = current_timestamp

        if (publicInputs.length > 5) {
            require(publicInputs[5] <= 1, "Invalid registration predicate");
        }
        if (publicInputs.length > 6) {
            require(publicInputs[6] <= 1, "Invalid insurance predicate");
        }
        if (publicInputs.length > 7) {
            require(publicInputs[7] <= 1, "Invalid year_range predicate");
        }
    }

    function checkProofValidity(
        bytes calldata proof,
        uint256[] calldata publicInputs,
        bytes32 credentialId
    ) external view returns (bool) {
        if (!registry.isCredentialValid(credentialId)) return false;
        if (proof.length == 0) return false;
        if (publicInputs.length < 5) return false;

        bytes32 inputCredentialId = bytes32(publicInputs[0]);
        return inputCredentialId == credentialId;
    }
}

