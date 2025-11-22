// Driver's License Credential Circuit
// Implements zero-knowledge proofs for Driver's License with selective disclosure

use dep::std;

global FIELD_COUNT: u32 = 16;

struct DriversLicenseInputs {
    full_name: Field,
    date_of_birth: Field,
    license_number: Field,
    issuing_state_or_authority: Field,
    issue_date: Field,
    expiry_date: Field,
    vehicle_class: Field,
    endorsements: Field,
    restrictions: Field,
    address: Field,
    photo_hash: Field,
    credential_id: Field,
    holder_public_key: Field,
    nonce: Field,
    salt: Field,
    signature: Field,
}

struct DriversLicensePublicInputs {
    credential_id: pub Field,
    commitment: pub Field,
    disclosed_fields_bitmap: pub Field,
    issuer_public_key: pub Field,
    holder_public_key: pub Field,
    // Predicates
    age_over_18: pub Field,
    age_over_21: pub Field,
    class_match: pub Field,
    not_expired: pub Field,
    current_timestamp: pub Field,
}

fn main(
    inputs: DriversLicenseInputs,
    public_inputs: DriversLicensePublicInputs,
    // Disclosed values
    disclosed_name: pub Field,
    disclosed_license_number: pub Field,
    disclosed_class: pub Field,
    disclosed_restrictions: pub Field,
) {
    // 1. Compute Poseidon commitment
    let fields: [Field; FIELD_COUNT] = [
        inputs.full_name,
        inputs.date_of_birth,
        inputs.license_number,
        inputs.issuing_state_or_authority,
        inputs.issue_date,
        inputs.expiry_date,
        inputs.vehicle_class,
        inputs.endorsements,
        inputs.restrictions,
        inputs.address,
        inputs.photo_hash,
        inputs.credential_id,
        inputs.holder_public_key,
        inputs.nonce,
        inputs.salt,
        inputs.signature,
    ];
    
    let computed_commitment = std::hash::poseidon::bn254::hash_16(fields);
    
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
    
    // Bit 1: license_number
    if (((bitmap >> 1) & 1) as bool) {
        assert(disclosed_license_number == inputs.license_number);
    } else {
        assert(disclosed_license_number == 0);
    }
    
    // Bit 2: vehicle_class
    if (((bitmap >> 2) & 1) as bool) {
        assert(disclosed_class == inputs.vehicle_class);
    } else {
        assert(disclosed_class == 0);
    }
    
    // Bit 3: restrictions
    if (((bitmap >> 3) & 1) as bool) {
        assert(disclosed_restrictions == inputs.restrictions);
    } else {
        assert(disclosed_restrictions == 0);
    }
    
    // 7. Age predicates
    let age = public_inputs.current_timestamp - inputs.date_of_birth;
    
    if (public_inputs.age_over_18 == 1) {
        assert(age >= 18);
    }
    
    if (public_inputs.age_over_21 == 1) {
        assert(age >= 21);
    }
    
    // 8. Vehicle class check
    if (public_inputs.class_match != 0) {
        assert(inputs.vehicle_class == public_inputs.class_match);
    }
    
    // 9. Expiry check
    if (public_inputs.not_expired == 1) {
        assert(public_inputs.current_timestamp < inputs.expiry_date);
    }
}

