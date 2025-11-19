// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CredentialRegistry.sol";

/**
 * @title CitizenshipCardVerifier
 * @dev On-chain ZK proof verification for Citizenship Card credentials
 */
contract CitizenshipCardVerifier {
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
     * @dev Verify Citizenship Card ZK proof on-chain
     */
    function verifyCitizenshipCard(
        bytes calldata proof,
        uint256[] calldata publicInputs,
        bytes32 credentialId
    ) external returns (bool) {
        // 1. Check credential validity
        require(registry.isCredentialValid(credentialId), "Credential invalid or revoked");

        // 2. Verify proof format
        require(proof.length > 0, "Invalid proof");
        require(publicInputs.length >= 5, "Invalid public inputs");

        // 3. Extract and verify credential ID
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
        // publicInputs[5] = age_over_18
        // publicInputs[6] = age_over_21
        // publicInputs[7] = nationality_match
        // publicInputs[8] = not_expired
        // publicInputs[9] = current_timestamp

        if (publicInputs.length > 5) {
            require(publicInputs[5] <= 1, "Invalid age_18 predicate");
        }
        if (publicInputs.length > 6) {
            require(publicInputs[6] <= 1, "Invalid age_21 predicate");
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

