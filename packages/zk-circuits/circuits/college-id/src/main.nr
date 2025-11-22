// College ID Credential Circuit
// Implements zero-knowledge proofs for College ID credentials with selective disclosure

use dep::std;

global FIELD_COUNT: u32 = 16;

// All private inputs - credential fields
struct CollegeIDInputs {
    full_name: Field,
    date_of_birth: Field,
    student_id: Field,
    institution_name: Field,
    program: Field,
    year_of_study: Field,
    student_status: Field,
    issue_date: Field,
    expiry_date: Field,
    photo_hash: Field,
    credential_id: Field,
    holder_public_key: Field,
    issuer_id: Field,
    nonce: Field,
    salt: Field,
    signature: Field,
}

// Public inputs
struct CollegeIDPublicInputs {
    credential_id: pub Field,
    commitment: pub Field,
    disclosed_fields_bitmap: pub Field,
    issuer_public_key: pub Field,
    holder_public_key: pub Field,
    // Predicate results
    age_over_18: pub Field,
    year_valid: pub Field,
    status_active: pub Field,
    current_timestamp: pub Field,
}

// Main circuit function
fn main(
    inputs: CollegeIDInputs,
    public_inputs: CollegeIDPublicInputs,
    // Disclosed field values (only revealed if bitmap allows)
    disclosed_full_name: pub Field,
    disclosed_institution: pub Field,
    disclosed_program: pub Field,
    disclosed_year: pub Field,
    disclosed_status: pub Field,
) {
    // 1. Compute Poseidon commitment of all private fields
    let mut fields_to_hash: [Field; FIELD_COUNT] = [
        inputs.full_name,
        inputs.date_of_birth,
        inputs.student_id,
        inputs.institution_name,
        inputs.program,
        inputs.year_of_study,
        inputs.student_status,
        inputs.issue_date,
        inputs.expiry_date,
        inputs.photo_hash,
        inputs.credential_id,
        inputs.holder_public_key,
        inputs.issuer_id,
        inputs.nonce,
        inputs.salt,
        inputs.signature,
    ];
    
    let computed_commitment = std::hash::poseidon::bn254::hash_16(fields_to_hash);
    
    // 2. Verify commitment matches public input
    assert(computed_commitment == public_inputs.commitment);
    
    // 3. Verify credential ID matches
    assert(inputs.credential_id == public_inputs.credential_id);
    
    // 4. Verify holder public key binding
    assert(inputs.holder_public_key == public_inputs.holder_public_key);
    
    // 5. Verify issuer signature (simplified - in production use proper ECDSA)
    // For now, verify signature field is consistent with issuer
    let signature_check = std::hash::poseidon::bn254::hash_2([computed_commitment, public_inputs.issuer_public_key]);
    assert(inputs.signature == signature_check);
    
    // 6. Selective disclosure - only reveal fields if bitmap allows
    // Bitmap: bit 0 = full_name, bit 1 = institution, bit 2 = program, bit 3 = year, bit 4 = status
    let bitmap = public_inputs.disclosed_fields_bitmap;
    
    // Check bit 0 for full_name
    let reveal_name = (bitmap & 1) as bool;
    if reveal_name {
        assert(disclosed_full_name == inputs.full_name);
    } else {
        assert(disclosed_full_name == 0);
    }
    
    // Check bit 1 for institution
    let reveal_institution = ((bitmap >> 1) & 1) as bool;
    if reveal_institution {
        assert(disclosed_institution == inputs.institution_name);
    } else {
        assert(disclosed_institution == 0);
    }
    
    // Check bit 2 for program
    let reveal_program = ((bitmap >> 2) & 1) as bool;
    if reveal_program {
        assert(disclosed_program == inputs.program);
    } else {
        assert(disclosed_program == 0);
    }
    
    // Check bit 3 for year
    let reveal_year = ((bitmap >> 3) & 1) as bool;
    if reveal_year {
        assert(disclosed_year == inputs.year_of_study);
    } else {
        assert(disclosed_year == 0);
    }
    
    // Check bit 4 for status
    let reveal_status = ((bitmap >> 4) & 1) as bool;
    if reveal_status {
        assert(disclosed_status == inputs.student_status);
    } else {
        assert(disclosed_status == 0);
    }
    
    // 7. Predicate: Age over 18
    // Compute age from date_of_birth and current_timestamp
    // Simplified: assume timestamps are in years since epoch
    let age = public_inputs.current_timestamp - inputs.date_of_birth;
    if public_inputs.age_over_18 == 1 {
        assert(age >= 18);
    }
    
    // 8. Predicate: Year of study is valid (1-4)
    if public_inputs.year_valid == 1 {
        assert(inputs.year_of_study >= 1);
        assert(inputs.year_of_study <= 4);
    }
    
    // 9. Predicate: Status is active (1 = active, 0 = inactive)
    if public_inputs.status_active == 1 {
        assert(inputs.student_status == 1);
    }
    
    // 10. Verify credential not expired
    assert(public_inputs.current_timestamp < inputs.expiry_date);
}

