// Vehicle Registration Card Credential Circuit
// Implements zero-knowledge proofs for Vehicle Registration with selective disclosure

use dep::std;

global FIELD_COUNT: u32 = 16;

struct VehicleRegistrationInputs {
    registration_number: Field,
    owner_name: Field,
    owner_public_key: Field,
    vehicle_vin: Field,
    vehicle_make: Field,
    vehicle_model: Field,
    vehicle_year: Field,
    engine_number: Field,
    registration_date: Field,
    expiry_date: Field,
    insurance_policy_number: Field,
    issuing_authority: Field,
    photo_hash: Field,
    credential_id: Field,
    nonce: Field,
    salt: Field,
}

struct VehicleRegistrationPublicInputs {
    credential_id: pub Field,
    commitment: pub Field,
    disclosed_fields_bitmap: pub Field,
    issuer_public_key: pub Field,
    owner_public_key: pub Field,
    // Predicates
    registration_valid: pub Field,
    insurance_valid: pub Field,
    year_range_check: pub Field,
    min_year: pub Field,
    max_year: pub Field,
    current_timestamp: pub Field,
}

fn main(
    inputs: VehicleRegistrationInputs,
    public_inputs: VehicleRegistrationPublicInputs,
    signature: Field,
    // Disclosed values
    disclosed_registration: pub Field,
    disclosed_owner: pub Field,
    disclosed_make: pub Field,
    disclosed_model: pub Field,
    disclosed_year: pub Field,
) {
    // 1. Compute Poseidon commitment
    let fields: [Field; FIELD_COUNT] = [
        inputs.registration_number,
        inputs.owner_name,
        inputs.owner_public_key,
        inputs.vehicle_vin,
        inputs.vehicle_make,
        inputs.vehicle_model,
        inputs.vehicle_year,
        inputs.engine_number,
        inputs.registration_date,
        inputs.expiry_date,
        inputs.insurance_policy_number,
        inputs.issuing_authority,
        inputs.photo_hash,
        inputs.credential_id,
        inputs.nonce,
        inputs.salt,
    ];
    
    let computed_commitment = std::hash::poseidon::bn254::hash_16(fields);
    
    // 2. Verify commitment
    assert(computed_commitment == public_inputs.commitment);
    
    // 3. Verify credential ID
    assert(inputs.credential_id == public_inputs.credential_id);
    
    // 4. Verify owner public key binding
    assert(inputs.owner_public_key == public_inputs.owner_public_key);
    
    // 5. Verify signature
    let sig_check = std::hash::poseidon::bn254::hash_2([computed_commitment, public_inputs.issuer_public_key]);
    assert(signature == sig_check);
    
    // 6. Selective disclosure
    let bitmap = public_inputs.disclosed_fields_bitmap;
    
    // Bit 0: registration_number
    if ((bitmap & 1) as bool) {
        assert(disclosed_registration == inputs.registration_number);
    } else {
        assert(disclosed_registration == 0);
    }
    
    // Bit 1: owner_name
    if (((bitmap >> 1) & 1) as bool) {
        assert(disclosed_owner == inputs.owner_name);
    } else {
        assert(disclosed_owner == 0);
    }
    
    // Bit 2: vehicle_make
    if (((bitmap >> 2) & 1) as bool) {
        assert(disclosed_make == inputs.vehicle_make);
    } else {
        assert(disclosed_make == 0);
    }
    
    // Bit 3: vehicle_model
    if (((bitmap >> 3) & 1) as bool) {
        assert(disclosed_model == inputs.vehicle_model);
    } else {
        assert(disclosed_model == 0);
    }
    
    // Bit 4: vehicle_year
    if (((bitmap >> 4) & 1) as bool) {
        assert(disclosed_year == inputs.vehicle_year);
    } else {
        assert(disclosed_year == 0);
    }
    
    // 7. Registration validity check
    if (public_inputs.registration_valid == 1) {
        assert(public_inputs.current_timestamp < inputs.expiry_date);
        assert(public_inputs.current_timestamp >= inputs.registration_date);
    }
    
    // 8. Insurance check (simplified - just check it exists)
    if (public_inputs.insurance_valid == 1) {
        assert(inputs.insurance_policy_number != 0);
    }
    
    // 9. Vehicle year range check
    if (public_inputs.year_range_check == 1) {
        assert(inputs.vehicle_year >= public_inputs.min_year);
        assert(inputs.vehicle_year <= public_inputs.max_year);
    }
}

