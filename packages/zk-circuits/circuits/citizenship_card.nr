// Citizenship Card Credential Circuit
// Implements zero-knowledge proofs for Citizenship Card with selective disclosure

use dep::std;

global FIELD_COUNT: u32 = 18;

struct CitizenshipCardInputs {
    full_name: Field,
    date_of_birth: Field,
    national_id_number: Field,
    nationality: Field,
    place_of_birth: Field,
    gender: Field,
    residential_address: Field,
    issue_date: Field,
    expiry_date: Field,
    biometric_hash: Field,
    photo_hash: Field,
    credential_id: Field,
    holder_public_key: Field,
    issuing_authority: Field,
    nonce: Field,
    salt: Field,
    signature: Field,
    // Additional field for array padding
    reserved: Field,
}

struct CitizenshipPublicInputs {
    credential_id: pub Field,
    commitment: pub Field,
    disclosed_fields_bitmap: pub Field,
    issuer_public_key: pub Field,
    holder_public_key: pub Field,
    // Predicate results
    age_over_18: pub Field,
    age_over_21: pub Field,
    nationality_match: pub Field,
    not_expired: pub Field,
    current_timestamp: pub Field,
}

fn main(
    inputs: CitizenshipCardInputs,
    public_inputs: CitizenshipPublicInputs,
    // Disclosed values
    disclosed_name: pub Field,
    disclosed_nationality: pub Field,
    disclosed_gender: pub Field,
    disclosed_address: pub Field,
) {
    // 1. Compute Poseidon commitment
    let mut fields: [Field; FIELD_COUNT] = [
        inputs.full_name,
        inputs.date_of_birth,
        inputs.national_id_number,
        inputs.nationality,
        inputs.place_of_birth,
        inputs.gender,
        inputs.residential_address,
        inputs.issue_date,
        inputs.expiry_date,
        inputs.biometric_hash,
        inputs.photo_hash,
        inputs.credential_id,
        inputs.holder_public_key,
        inputs.issuing_authority,
        inputs.nonce,
        inputs.salt,
        inputs.signature,
        inputs.reserved,
    ];
    
    let computed_commitment = std::hash::poseidon::bn254::hash_18(fields);
    
    // 2. Verify commitment
    assert(computed_commitment == public_inputs.commitment);
    
    // 3. Verify credential ID
    assert(inputs.credential_id == public_inputs.credential_id);
    
    // 4. Verify holder public key
    assert(inputs.holder_public_key == public_inputs.holder_public_key);
    
    // 5. Verify signature
    let sig_check = std::hash::poseidon::bn254::hash_2([computed_commitment, public_inputs.issuer_public_key]);
    assert(inputs.signature == sig_check);
    
    // 6. Selective disclosure
    let bitmap = public_inputs.disclosed_fields_bitmap;
    
    // Bit 0: full_name
    if ((bitmap & 1) as bool) {
        assert(disclosed_name == inputs.full_name);
    } else {
        assert(disclosed_name == 0);
    }
    
    // Bit 1: nationality
    if (((bitmap >> 1) & 1) as bool) {
        assert(disclosed_nationality == inputs.nationality);
    } else {
        assert(disclosed_nationality == 0);
    }
    
    // Bit 2: gender
    if (((bitmap >> 2) & 1) as bool) {
        assert(disclosed_gender == inputs.gender);
    } else {
        assert(disclosed_gender == 0);
    }
    
    // Bit 3: address
    if (((bitmap >> 3) & 1) as bool) {
        assert(disclosed_address == inputs.residential_address);
    } else {
        assert(disclosed_address == 0);
    }
    
    // 7. Age predicates
    let age = public_inputs.current_timestamp - inputs.date_of_birth;
    
    if (public_inputs.age_over_18 == 1) {
        assert(age >= 18);
    }
    
    if (public_inputs.age_over_21 == 1) {
        assert(age >= 21);
    }
    
    // 8. Nationality check (if enabled)
    if (public_inputs.nationality_match != 0) {
        assert(inputs.nationality == public_inputs.nationality_match);
    }
    
    // 9. Expiry check
    if (public_inputs.not_expired == 1) {
        assert(public_inputs.current_timestamp < inputs.expiry_date);
    }
}

