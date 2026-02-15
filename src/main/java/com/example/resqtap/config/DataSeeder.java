package com.example.resqtap.config;

import com.example.resqtap.model.Emergency;
import com.example.resqtap.model.Emergency.Severity;
import com.example.resqtap.repository.EmergencyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class DataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    @Order(1)
    public CommandLineRunner seedEmergencies(EmergencyRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                logger.info("Database already seeded with {} emergencies", repository.count());
                return;
            }

            logger.info("Seeding 72 emergency types...");

            // ==================== CARDIAC EMERGENCIES ====================
            seedEmergency(repository, "CPR Adult", "cardiac", Severity.CRITICAL,
                "Cardiopulmonary resuscitation for adults (18+ years)",
                new String[][]{
                    {"Check for responsiveness by tapping shoulders and shouting", "/images/cpr/adult/check_response.png"},
                    {"Call 911 or have someone call immediately", "/images/cpr/adult/call_911.png"},
                    {"Place heel of hand on center of chest between nipples", "/images/cpr/adult/hand_position.png"},
                    {"Push hard and fast: 2 inches deep, 100-120 compressions per minute", "/images/cpr/adult/compressions.png"},
                    {"Give 2 rescue breaths after every 30 compressions", "/images/cpr/adult/rescue_breaths.png"},
                    {"Continue until help arrives or person starts breathing", "/images/cpr/adult/continue_cpr.png"}
                });

            seedEmergency(repository, "CPR Child", "cardiac", Severity.CRITICAL,
                "Cardiopulmonary resuscitation for children (1-12 years)",
                new String[][]{
                    {"Check for responsiveness by tapping and calling loudly", "/images/cpr/child/check_response.png"},
                    {"Call 911 after 2 minutes of CPR if alone", "/images/cpr/child/call_911.png"},
                    {"Use one or two hands for chest compressions", "/images/cpr/child/hand_position.png"},
                    {"Push about 2 inches deep at 100-120 compressions per minute", "/images/cpr/child/compressions.png"},
                    {"Give 2 rescue breaths after every 30 compressions", "/images/cpr/child/rescue_breaths.png"},
                    {"Continue until help arrives or child responds", "/images/cpr/child/continue_cpr.png"}
                });

            seedEmergency(repository, "CPR Infant", "cardiac", Severity.CRITICAL,
                "Cardiopulmonary resuscitation for infants (under 1 year)",
                new String[][]{
                    {"Tap the bottom of feet and call the infant's name", "/images/cpr/infant/check_response.png"},
                    {"Call 911 after 2 minutes of CPR if alone", "/images/cpr/infant/call_911.png"},
                    {"Use two fingers on center of chest just below nipple line", "/images/cpr/infant/finger_position.png"},
                    {"Push about 1.5 inches deep at 100-120 compressions per minute", "/images/cpr/infant/compressions.png"},
                    {"Give 2 gentle rescue breaths covering mouth and nose", "/images/cpr/infant/rescue_breaths.png"},
                    {"Continue until help arrives or infant responds", "/images/cpr/infant/continue_cpr.png"}
                });

            seedEmergency(repository, "Heart Attack", "cardiac", Severity.CRITICAL,
                "Myocardial infarction requiring immediate medical attention",
                new String[][]{
                    {"Recognize the warning signs: Chest pain or pressure (squeezing, fullness), pain radiating to arm/jaw/back/neck, shortness of breath, cold sweat, nausea, lightheadedness", "/images/cardiac/heart_attack_recognize.png"},
                    {"Call 911 immediately: State 'possible heart attack.' Every minute counts - heart muscle is dying. Do not drive the person yourself unless no other option", "/images/cardiac/heart_attack_call.png"},
                    {"Have person stop all activity: Help them sit or lie in comfortable position, typically semi-reclined. Staying still reduces heart's workload", "/images/cardiac/heart_attack_rest.png"},
                    {"Give aspirin if available: Ask 'Are you allergic to aspirin?' If not, give one regular aspirin (325mg) or four baby aspirin (81mg each) to CHEW, not swallow whole", "/images/cardiac/heart_attack_aspirin.png"},
                    {"Loosen restrictive clothing: Unbutton shirt, loosen belt and tie. This helps with breathing and reduces constriction on chest", "/images/cardiac/heart_attack_loosen.png"},
                    {"Help with prescribed medications: If person has nitroglycerin, help them take it as prescribed. They may take up to 3 doses, 5 minutes apart", "/images/cardiac/heart_attack_nitro.png"},
                    {"Monitor and prepare for CPR: Watch for loss of consciousness or stoppage of breathing. If person becomes unresponsive and isn't breathing normally, begin CPR immediately", "/images/cardiac/heart_attack_monitor.png"},
                    {"Keep person calm: Anxiety increases heart's oxygen demand. Reassure them help is coming. Stay with them until EMS arrives and takes over", "/images/cardiac/heart_attack_calm.png"}
                });

            seedEmergency(repository, "Cardiac Arrest", "cardiac", Severity.CRITICAL,
                "Heart has stopped beating - immediate CPR required",
                new String[][]{
                    {"Call 911 immediately", "/images/cardiac/arrest_call.png"},
                    {"Begin CPR immediately with chest compressions", "/images/cardiac/arrest_cpr.png"},
                    {"Send someone to get an AED if available", "/images/cardiac/arrest_aed.png"},
                    {"Apply AED as soon as available and follow prompts", "/images/cardiac/arrest_apply_aed.png"},
                    {"Continue CPR between AED shocks", "/images/cardiac/arrest_continue.png"},
                    {"Do not stop until emergency services take over", "/images/cardiac/arrest_persist.png"}
                });

            seedEmergency(repository, "AED Usage", "cardiac", Severity.CRITICAL,
                "Automated External Defibrillator operation guide",
                new String[][]{
                    {"Turn on the AED and follow voice prompts", "/images/cardiac/aed_turnon.png"},
                    {"Expose the chest and wipe dry if wet", "/images/cardiac/aed_expose.png"},
                    {"Attach pads to bare chest as shown on pads", "/images/cardiac/aed_pads.png"},
                    {"Ensure no one is touching the person during analysis", "/images/cardiac/aed_clear.png"},
                    {"Press shock button if advised by AED", "/images/cardiac/aed_shock.png"},
                    {"Immediately resume CPR after shock", "/images/cardiac/aed_resume.png"}
                });

            // ==================== CHOKING EMERGENCIES ====================
            seedEmergency(repository, "Choking Adult", "airway", Severity.CRITICAL,
                "Airway obstruction in adults requiring Heimlich maneuver",
                new String[][]{
                    {"Assess the situation: Ask 'Are you choking?' If the person cannot speak, cough forcefully, or breathe, they have a severe obstruction requiring immediate action", "/images/choking/adult_ask.png"},
                    {"Call 911 or direct someone specific to call. Say 'You in the red shirt, call 911 now!' Stay with the victim", "/images/choking/adult_call.png"},
                    {"Position yourself: Stand behind the person with one foot between their feet for stability. Wrap your arms around their waist", "/images/choking/adult_position.png"},
                    {"Hand placement: Make a fist with your dominant hand. Place thumb side against the abdomen, above the navel and well below the breastbone", "/images/choking/adult_fist.png"},
                    {"Perform abdominal thrusts: Grasp your fist with your other hand. Pull sharply inward and upward in a J-shaped motion. Repeat until object is expelled or person becomes unconscious", "/images/choking/adult_thrust.png"},
                    {"If unconscious: Lower person to ground carefully. Call 911 if not done. Begin CPR starting with chest compressions. Check mouth for visible object before giving breaths", "/images/choking/adult_cpr.png"},
                    {"After object is expelled: Encourage person to seek medical evaluation. Some internal injury may have occurred from thrusts", "/images/choking/adult_after.png"}
                });

            seedEmergency(repository, "Choking Child", "airway", Severity.CRITICAL,
                "Airway obstruction in children (1-12 years)",
                new String[][]{
                    {"Determine if child can cough, cry, or speak", "/images/choking/child_assess.png"},
                    {"Call 911 if complete obstruction", "/images/choking/child_call.png"},
                    {"Kneel behind child and perform abdominal thrusts", "/images/choking/child_position.png"},
                    {"Use less force than for adults", "/images/choking/child_thrust.png"},
                    {"Continue until object is expelled or child becomes unconscious", "/images/choking/child_continue.png"},
                    {"Begin CPR if child becomes unconscious", "/images/choking/child_cpr.png"}
                });

            seedEmergency(repository, "Choking Infant", "airway", Severity.CRITICAL,
                "Airway obstruction in infants (under 1 year)",
                new String[][]{
                    {"Recognize choking: Infant cannot cry, cough, or breathe. May turn blue. Silent choking is a medical emergency", "/images/choking/infant_recognize.png"},
                    {"Position for back blows: Hold infant face-down along your forearm, head lower than chest. Support jaw with your hand without covering mouth", "/images/choking/infant_position.png"},
                    {"Give 5 back blows: Use heel of your hand to deliver 5 firm blows between shoulder blades. Check if object is expelled after each blow", "/images/choking/infant_backblows.png"},
                    {"Turn infant over: Support head and neck. Sandwich infant between forearms and turn face-up, keeping head lower than body", "/images/choking/infant_turnover.png"},
                    {"Give 5 chest thrusts: Place 2 fingers on breastbone just below nipple line. Give 5 quick downward thrusts about 1.5 inches deep", "/images/choking/infant_thrusts.png"},
                    {"Repeat cycle: Continue alternating 5 back blows and 5 chest thrusts until object is expelled or infant becomes unconscious", "/images/choking/infant_repeat.png"},
                    {"If unconscious: Call 911. Begin infant CPR. Look in mouth before giving breaths - only remove object if clearly visible", "/images/choking/infant_cpr.png"}
                });

            // ==================== DROWNING ====================
            seedEmergency(repository, "Drowning", "water", Severity.CRITICAL,
                "Water submersion emergency requiring immediate rescue",
                new String[][]{
                    {"Ensure your own safety first: Do not enter water unless trained. Use reach-throw-row-go method. Throw flotation device or extend pole/towel", "/images/water/drowning_safety.png"},
                    {"Call 911 immediately or direct a bystander to call while you begin rescue", "/images/water/drowning_call.png"},
                    {"Remove from water: Support head and neck if diving injury suspected. Get person horizontal and onto firm surface", "/images/water/drowning_remove.png"},
                    {"Check responsiveness: Tap shoulders, shout 'Are you okay?' Look for chest rise, listen for breathing for no more than 10 seconds", "/images/water/drowning_check.png"},
                    {"Begin rescue breathing: If not breathing but has pulse, give 1 rescue breath every 5-6 seconds. Recheck pulse every 2 minutes", "/images/water/drowning_breathing.png"},
                    {"Begin CPR if no pulse: 30 chest compressions then 2 breaths. Push hard and fast, 2 inches deep, 100-120 per minute. Do not stop", "/images/water/drowning_cpr.png"},
                    {"Continue until: Person responds, AED arrives, trained help takes over, or you are physically exhausted", "/images/water/drowning_continue.png"},
                    {"Prevent hypothermia: Remove wet clothing, cover with blankets. Even if person seems fine, insist on medical evaluation", "/images/water/drowning_warm.png"}
                });

            seedEmergency(repository, "Near Drowning", "water", Severity.HIGH,
                "Person rescued from water who is breathing",
                new String[][]{
                    {"Prioritize spinal precautions: If person dove, fell, or mechanism unknown, assume spinal injury. Keep head, neck, and spine aligned", "/images/water/near_spinal.png"},
                    {"Remove from water carefully: Use backboard if available. Multiple rescuers should coordinate to keep spine aligned", "/images/water/near_remove.png"},
                    {"Call 911: All near-drowning victims need hospital evaluation. Secondary drowning can occur hours later from water in lungs", "/images/water/near_call.png"},
                    {"Position for breathing: If no spinal injury suspected, place in recovery position (on side) to prevent aspiration if vomiting occurs", "/images/water/near_recovery.png"},
                    {"Monitor continuously: Watch for changes in consciousness, breathing difficulty, or coughing. Note time in water if known", "/images/water/near_monitor.png"},
                    {"Prevent hypothermia: Remove wet clothing, wrap in blankets, move to warm environment. Even warm water can cause hypothermia", "/images/water/near_warm.png"},
                    {"Stay with victim: Condition can worsen suddenly. Do not leave alone until EMS arrives and takes over care", "/images/water/near_stay.png"}
                });

            // ==================== BLEEDING EMERGENCIES ====================
            seedEmergency(repository, "Severe Bleeding", "trauma", Severity.CRITICAL,
                "Life-threatening hemorrhage requiring immediate control",
                new String[][]{
                    {"Ensure scene safety: Put on gloves if available. Call 911 immediately - severe bleeding is life-threatening", "/images/trauma/bleeding_safety.png"},
                    {"Expose the wound: Remove or cut away clothing to clearly see injury. Identify the source of bleeding", "/images/trauma/bleeding_expose.png"},
                    {"Apply direct pressure: Use clean cloth, gauze, or clothing. Press firmly with both hands directly on the wound. Do not let go", "/images/trauma/bleeding_pressure.png"},
                    {"Pack deep wounds: For large or deep wounds, stuff clean cloth into wound while maintaining pressure. This is called wound packing", "/images/trauma/bleeding_pack.png"},
                    {"If blood soaks through: Do NOT remove first dressing. Add more layers on top and increase pressure. Removing disturbs clotting", "/images/trauma/bleeding_layers.png"},
                    {"Consider tourniquet for limb wounds: Apply 2-3 inches above wound, not on joint. Tighten until bleeding stops. Note the time applied", "/images/trauma/bleeding_tourniquet.png"},
                    {"Position victim: Keep them lying down. Elevate legs if no spinal injury suspected. Keep them warm with blankets", "/images/trauma/bleeding_position.png"},
                    {"Monitor for shock: Watch for pale skin, rapid pulse, confusion, anxiety. These indicate significant blood loss requiring immediate transport", "/images/trauma/bleeding_shock.png"}
                });

            seedEmergency(repository, "Minor Bleeding", "trauma", Severity.LOW,
                "Small cuts and scrapes requiring basic first aid",
                new String[][]{
                    {"Wash hands before treating wound", "/images/trauma/minor_hands.png"},
                    {"Clean wound gently with clean water", "/images/trauma/minor_clean.png"},
                    {"Apply gentle pressure with clean cloth", "/images/trauma/minor_pressure.png"},
                    {"Apply antibiotic ointment if available", "/images/trauma/minor_antibiotic.png"},
                    {"Cover with sterile bandage", "/images/trauma/minor_bandage.png"},
                    {"Change bandage daily and watch for infection", "/images/trauma/minor_monitor.png"}
                });

            seedEmergency(repository, "Nosebleed", "trauma", Severity.LOW,
                "Epistaxis - bleeding from the nose",
                new String[][]{
                    {"Have person sit upright and lean slightly forward", "/images/trauma/nose_position.png"},
                    {"Pinch soft part of nose firmly", "/images/trauma/nose_pinch.png"},
                    {"Hold for 10-15 minutes without releasing", "/images/trauma/nose_hold.png"},
                    {"Apply cold compress to bridge of nose", "/images/trauma/nose_cold.png"},
                    {"Seek medical help if bleeding persists beyond 20 minutes", "/images/trauma/nose_help.png"},
                    {"Do not blow nose or pick at clot for several hours", "/images/trauma/nose_avoid.png"}
                });

            // ==================== BURNS ====================
            seedEmergency(repository, "First Degree Burn", "burns", Severity.LOW,
                "Superficial burn affecting only outer skin layer",
                new String[][]{
                    {"Remove from heat source immediately", "/images/burns/first_remove.png"},
                    {"Cool burn under cool running water for 10-20 minutes", "/images/burns/first_cool.png"},
                    {"Do not use ice or very cold water", "/images/burns/first_noice.png"},
                    {"Apply aloe vera or burn cream", "/images/burns/first_aloe.png"},
                    {"Cover loosely with sterile bandage", "/images/burns/first_cover.png"},
                    {"Take over-the-counter pain reliever if needed", "/images/burns/first_pain.png"}
                });

            seedEmergency(repository, "Second Degree Burn", "burns", Severity.MEDIUM,
                "Partial thickness burn with blistering",
                new String[][]{
                    {"Remove from heat source and remove clothing near burn", "/images/burns/second_remove.png"},
                    {"Cool burn under cool running water for 15-20 minutes", "/images/burns/second_cool.png"},
                    {"Do not break blisters", "/images/burns/second_blisters.png"},
                    {"Cover with non-stick sterile bandage", "/images/burns/second_cover.png"},
                    {"Seek medical attention for large burns or burns on face/hands", "/images/burns/second_medical.png"},
                    {"Watch for signs of infection", "/images/burns/second_infection.png"}
                });

            seedEmergency(repository, "Third Degree Burn", "burns", Severity.CRITICAL,
                "Full thickness burn requiring emergency care",
                new String[][]{
                    {"Call 911 immediately", "/images/burns/third_call.png"},
                    {"Do not remove burned clothing stuck to skin", "/images/burns/third_clothing.png"},
                    {"Cover burn loosely with clean cloth", "/images/burns/third_cover.png"},
                    {"Elevate burned area above heart if possible", "/images/burns/third_elevate.png"},
                    {"Monitor for shock - keep person warm", "/images/burns/third_shock.png"},
                    {"Do not apply creams, butter, or ointments", "/images/burns/third_nocream.png"}
                });

            seedEmergency(repository, "Chemical Burn", "burns", Severity.HIGH,
                "Burn caused by corrosive chemicals",
                new String[][]{
                    {"Protect yourself first: Wear gloves if available. Do not touch the chemical with bare hands. Ensure area is ventilated if fumes are present", "/images/burns/chemical_protect.png"},
                    {"Remove contaminated clothing: Cut away clothing if stuck to skin. Remove jewelry, watches, belts that may trap chemical. Work quickly but carefully", "/images/burns/chemical_remove.png"},
                    {"Flush immediately with water: Use large amounts of cool running water for at least 20 minutes. For eyes, hold lids open and flush from inner corner outward", "/images/burns/chemical_flush.png"},
                    {"Do NOT neutralize: Never apply substances to counteract the chemical (like vinegar on alkali burns). This causes a heat reaction that worsens the injury", "/images/burns/chemical_neutral.png"},
                    {"Call Poison Control: 1-800-222-1222 (US). Have product container ready to identify the chemical. They provide specific treatment guidance", "/images/burns/chemical_call.png"},
                    {"Continue flushing while calling: Do not stop water irrigation to make phone calls. Continue for minimum 20 minutes or until EMS arrives", "/images/burns/chemical_continue.png"},
                    {"Cover loosely: After thorough flushing, cover burn with clean, dry, loose bandage or cloth. Do not apply ointments, creams, or butter", "/images/burns/chemical_cover.png"},
                    {"Save product information: Keep the chemical container, label, or SDS (Safety Data Sheet) for emergency responders. This guides hospital treatment", "/images/burns/chemical_save.png"}
                });

            seedEmergency(repository, "Electrical Burn", "burns", Severity.CRITICAL,
                "Burn caused by electrical current",
                new String[][]{
                    {"Do not touch person if still in contact with electrical source", "/images/burns/electrical_notouch.png"},
                    {"Turn off power source or separate person using non-conductive object", "/images/burns/electrical_separate.png"},
                    {"Call 911 immediately", "/images/burns/electrical_call.png"},
                    {"Check for breathing and pulse - begin CPR if needed", "/images/burns/electrical_cpr.png"},
                    {"Cover burns with sterile bandage", "/images/burns/electrical_cover.png"},
                    {"Monitor for cardiac problems even if person seems fine", "/images/burns/electrical_monitor.png"}
                });

            seedEmergency(repository, "Sunburn", "burns", Severity.LOW,
                "Radiation burn from sun exposure",
                new String[][]{
                    {"Get out of the sun immediately", "/images/burns/sun_shade.png"},
                    {"Cool skin with damp cloths or cool bath", "/images/burns/sun_cool.png"},
                    {"Apply aloe vera gel or moisturizer", "/images/burns/sun_aloe.png"},
                    {"Take over-the-counter pain reliever", "/images/burns/sun_pain.png"},
                    {"Drink plenty of water to prevent dehydration", "/images/burns/sun_hydrate.png"},
                    {"Seek medical help if blistering, fever, or chills occur", "/images/burns/sun_medical.png"}
                });

            // ==================== FRACTURES & BONE INJURIES ====================
            seedEmergency(repository, "Broken Bone", "trauma", Severity.HIGH,
                "Suspected fracture requiring immobilization",
                new String[][]{
                    {"Assess the injury: Look for deformity, swelling, bruising, or bone protruding through skin (open fracture). Note if person heard a snap or crack", "/images/trauma/fracture_assess.png"},
                    {"Call 911 if: Bone is visible, limb is deformed, person cannot move the limb, injury involves head/neck/back/hip/pelvis, or severe pain", "/images/trauma/fracture_call.png"},
                    {"Control any bleeding: If open fracture, apply gentle pressure around (not on) protruding bone. Do not push bone back in", "/images/trauma/fracture_bleeding.png"},
                    {"Immobilize the injury: Splint in position found. Include joint above and below fracture. Use rigid materials (boards, magazines) padded with cloth", "/images/trauma/fracture_splint.png"},
                    {"Apply cold pack: Wrap ice in cloth, apply to injury for 20 minutes. Reduces swelling and pain. Never apply ice directly to skin", "/images/trauma/fracture_ice.png"},
                    {"Elevate if possible: Raise injured limb above heart level only if it does not cause more pain. Helps reduce swelling", "/images/trauma/fracture_elevate.png"},
                    {"Monitor for shock: Watch for pale/clammy skin, rapid breathing, weakness. Keep person lying down and warm", "/images/trauma/fracture_shock.png"},
                    {"Do not: Straighten the limb, allow person to eat/drink (may need surgery), or remove splint once applied", "/images/trauma/fracture_donot.png"}
                });

            seedEmergency(repository, "Sprain", "trauma", Severity.MEDIUM,
                "Ligament injury from twisting or stretching",
                new String[][]{
                    {"Rest the injured area immediately", "/images/trauma/sprain_rest.png"},
                    {"Apply ice for 20 minutes every 2-3 hours", "/images/trauma/sprain_ice.png"},
                    {"Compress with elastic bandage but not too tight", "/images/trauma/sprain_compress.png"},
                    {"Elevate the injured area above heart level", "/images/trauma/sprain_elevate.png"},
                    {"Take over-the-counter pain medication if needed", "/images/trauma/sprain_pain.png"},
                    {"Seek medical care if unable to bear weight or severe swelling", "/images/trauma/sprain_medical.png"}
                });

            seedEmergency(repository, "Dislocation", "trauma", Severity.HIGH,
                "Joint displacement requiring medical attention",
                new String[][]{
                    {"Recognize a dislocation: Joint looks visibly deformed or out of place. Intense pain, inability to move joint, rapid swelling", "/images/trauma/dislocate_recognize.png"},
                    {"Call 911: Especially for shoulder, hip, knee, or elbow dislocations. All dislocations need professional reduction", "/images/trauma/dislocate_call.png"},
                    {"Do NOT attempt to relocate: Never try to pop the joint back in. This can cause permanent nerve, blood vessel, or tissue damage", "/images/trauma/dislocate_nomove.png"},
                    {"Immobilize in position found: Use slings, pillows, or rolled blankets to support the joint exactly as you find it", "/images/trauma/dislocate_immobilize.png"},
                    {"Check circulation: Feel for pulse below injury. Check if fingers/toes are warm and can move. Numbness or cold indicates emergency", "/images/trauma/dislocate_circulation.png"},
                    {"Apply cold pack: Wrap ice in cloth, apply around (not directly on) joint. Reduces pain and swelling. Apply for 20 minutes", "/images/trauma/dislocate_ice.png"},
                    {"Treat for shock: Keep person lying down and warm. Elevate legs if no spinal injury suspected", "/images/trauma/dislocate_shock.png"},
                    {"Do not allow eating or drinking: Surgery may be needed to reduce the dislocation", "/images/trauma/dislocate_nofood.png"}
                });

            // ==================== HEAD & SPINAL INJURIES ====================
            seedEmergency(repository, "Head Injury", "trauma", Severity.HIGH,
                "Trauma to the head requiring evaluation",
                new String[][]{
                    {"Call 911 if person is unconscious or severely injured", "/images/trauma/head_call.png"},
                    {"Keep person still - do not move neck", "/images/trauma/head_still.png"},
                    {"Apply gentle pressure to bleeding wounds with clean cloth", "/images/trauma/head_pressure.png"},
                    {"Monitor for vomiting, confusion, or unequal pupils", "/images/trauma/head_monitor.png"},
                    {"Do not give food, water, or medications", "/images/trauma/head_nofood.png"},
                    {"Keep person awake if possible and talking to you", "/images/trauma/head_awake.png"}
                });

            seedEmergency(repository, "Concussion", "trauma", Severity.MEDIUM,
                "Mild traumatic brain injury from impact",
                new String[][]{
                    {"Remove from activity immediately", "/images/trauma/concussion_stop.png"},
                    {"Monitor for danger signs: vomiting, confusion, unequal pupils", "/images/trauma/concussion_monitor.png"},
                    {"Have person rest in quiet, dim environment", "/images/trauma/concussion_rest.png"},
                    {"Apply ice to any bumps", "/images/trauma/concussion_ice.png"},
                    {"Wake person every 2-3 hours if sleeping to check responsiveness", "/images/trauma/concussion_wake.png"},
                    {"Seek medical attention within 24 hours", "/images/trauma/concussion_medical.png"}
                });

            seedEmergency(repository, "Spinal Injury", "trauma", Severity.CRITICAL,
                "Suspected spinal cord injury - do not move",
                new String[][]{
                    {"Call 911 immediately", "/images/trauma/spinal_call.png"},
                    {"Do not move the person under any circumstances", "/images/trauma/spinal_nomove.png"},
                    {"Stabilize head and neck with hands", "/images/trauma/spinal_stabilize.png"},
                    {"Keep person calm and still", "/images/trauma/spinal_calm.png"},
                    {"Monitor breathing and be ready for CPR", "/images/trauma/spinal_breathing.png"},
                    {"Cover with blanket to maintain body temperature", "/images/trauma/spinal_warm.png"}
                });

            // ==================== ALLERGIC REACTIONS ====================
            seedEmergency(repository, "Anaphylaxis", "allergic", Severity.CRITICAL,
                "Severe allergic reaction requiring epinephrine",
                new String[][]{
                    {"Recognize anaphylaxis: Symptoms include throat tightening, difficulty breathing, swelling of face/lips/tongue, hives, dizziness, rapid pulse. Can progress within minutes", "/images/allergic/anaphy_recognize.png"},
                    {"Call 911 immediately: State 'severe allergic reaction' or 'anaphylaxis.' This is a life-threatening emergency requiring immediate medical care", "/images/allergic/anaphy_call.png"},
                    {"Locate epinephrine auto-injector (EpiPen): Check person's bag, pockets, or ask them. Many allergy sufferers carry one. Time is critical", "/images/allergic/anaphy_find.png"},
                    {"Use EpiPen: Remove safety cap. Hold orange tip against outer mid-thigh (through clothing is OK). Press firmly until click. Hold for 10 seconds", "/images/allergic/anaphy_epipen.png"},
                    {"Position the person: If conscious and breathing, have them sit up for easier breathing. If showing signs of shock (pale, dizzy), lay flat with legs elevated", "/images/allergic/anaphy_position.png"},
                    {"Monitor breathing: Watch chest rise and fall. If breathing stops, begin CPR immediately. Be prepared - condition can deteriorate rapidly", "/images/allergic/anaphy_monitor.png"},
                    {"Second dose: If symptoms don't improve or return after 5-15 minutes, give second EpiPen on opposite thigh if available", "/images/allergic/anaphy_second.png"},
                    {"Stay until EMS arrives: Even if symptoms improve, person must go to hospital. Biphasic reaction can occur hours later", "/images/allergic/anaphy_stay.png"}
                });

            seedEmergency(repository, "Allergic Reaction", "allergic", Severity.MEDIUM,
                "Mild to moderate allergic response",
                new String[][]{
                    {"Remove or stop exposure to allergen", "/images/allergic/reaction_remove.png"},
                    {"Give antihistamine if available and person can swallow", "/images/allergic/reaction_antihistamine.png"},
                    {"Watch for signs of worsening: difficulty breathing, swelling", "/images/allergic/reaction_watch.png"},
                    {"Apply cool compress to itchy areas", "/images/allergic/reaction_cool.png"},
                    {"Call 911 if symptoms worsen rapidly", "/images/allergic/reaction_call.png"},
                    {"Seek medical attention if reaction is severe or persistent", "/images/allergic/reaction_medical.png"}
                });

            seedEmergency(repository, "Bee Sting", "allergic", Severity.MEDIUM,
                "Insect sting with potential allergic reaction",
                new String[][]{
                    {"Remove stinger by scraping sideways with credit card", "/images/allergic/bee_remove.png"},
                    {"Clean area with soap and water", "/images/allergic/bee_clean.png"},
                    {"Apply ice to reduce swelling", "/images/allergic/bee_ice.png"},
                    {"Take antihistamine for itching", "/images/allergic/bee_antihistamine.png"},
                    {"Watch for signs of allergic reaction", "/images/allergic/bee_watch.png"},
                    {"Call 911 if difficulty breathing or widespread reaction", "/images/allergic/bee_call.png"}
                });

            // ==================== POISONING ====================
            seedEmergency(repository, "Poisoning Ingested", "poisoning", Severity.CRITICAL,
                "Toxic substance swallowed",
                new String[][]{
                    {"Stay calm and assess: Determine what was swallowed, how much, and when. Look for containers, pills, or plant material nearby", "/images/poison/ingest_assess.png"},
                    {"Call Poison Control immediately: 1-800-222-1222 (US). Available 24/7. They will guide your specific situation. Have product container ready", "/images/poison/ingest_call.png"},
                    {"Do NOT induce vomiting: Unless specifically told by Poison Control. Some substances cause more damage coming back up (acids, alkalis, petroleum)", "/images/poison/ingest_novomit.png"},
                    {"Do NOT give anything by mouth: No water, milk, or activated charcoal unless directed by Poison Control. Wrong treatment can worsen situation", "/images/poison/ingest_nodrink.png"},
                    {"Call 911 if: Person is unconscious, having seizures, difficulty breathing, or Poison Control advises immediate emergency care", "/images/poison/ingest_911.png"},
                    {"Position unconscious victim: Place in recovery position (on side) to prevent choking if vomiting occurs. Monitor breathing constantly", "/images/poison/ingest_position.png"},
                    {"Save evidence: Keep container, pills, vomit, or any substance for identification. This helps medical staff provide correct treatment", "/images/poison/ingest_save.png"},
                    {"Monitor vital signs: Watch breathing rate, consciousness level, skin color. Note any changes to report to emergency responders", "/images/poison/ingest_monitor.png"}
                });

            seedEmergency(repository, "Poisoning Inhaled", "poisoning", Severity.CRITICAL,
                "Toxic gas or fumes inhaled",
                new String[][]{
                    {"Move person to fresh air immediately", "/images/poison/inhale_fresh.png"},
                    {"Call 911", "/images/poison/inhale_call.png"},
                    {"Open windows and doors if safe to do so", "/images/poison/inhale_ventilate.png"},
                    {"Begin CPR if person is not breathing", "/images/poison/inhale_cpr.png"},
                    {"Identify the source of fumes if known", "/images/poison/inhale_identify.png"},
                    {"Do not re-enter contaminated area", "/images/poison/inhale_noreenter.png"}
                });

            seedEmergency(repository, "Carbon Monoxide Poisoning", "poisoning", Severity.CRITICAL,
                "Exposure to carbon monoxide gas",
                new String[][]{
                    {"Get everyone out of the building immediately", "/images/poison/co_evacuate.png"},
                    {"Call 911 from outside", "/images/poison/co_call.png"},
                    {"Open windows if safe to do so", "/images/poison/co_ventilate.png"},
                    {"Move to fresh air and stay outside", "/images/poison/co_fresh.png"},
                    {"Begin CPR if person is not breathing", "/images/poison/co_cpr.png"},
                    {"Do not return inside until cleared by fire department", "/images/poison/co_noreenter.png"}
                });

            seedEmergency(repository, "Drug Overdose", "poisoning", Severity.CRITICAL,
                "Excessive drug consumption requiring emergency care",
                new String[][]{
                    {"Call 911 immediately", "/images/poison/overdose_call.png"},
                    {"Administer Narcan (naloxone) if opioid overdose suspected", "/images/poison/overdose_narcan.png"},
                    {"Place in recovery position if unconscious but breathing", "/images/poison/overdose_recovery.png"},
                    {"Begin CPR if not breathing", "/images/poison/overdose_cpr.png"},
                    {"Stay with person until help arrives", "/images/poison/overdose_stay.png"},
                    {"Tell responders what substances were taken", "/images/poison/overdose_inform.png"}
                });

            seedEmergency(repository, "Alcohol Poisoning", "poisoning", Severity.HIGH,
                "Dangerous level of alcohol consumption",
                new String[][]{
                    {"Call 911 if person is unconscious or has irregular breathing", "/images/poison/alcohol_call.png"},
                    {"Keep person sitting up if conscious", "/images/poison/alcohol_situp.png"},
                    {"Place in recovery position if unconscious", "/images/poison/alcohol_recovery.png"},
                    {"Do not leave person alone", "/images/poison/alcohol_stay.png"},
                    {"Do not give coffee or cold shower", "/images/poison/alcohol_myths.png"},
                    {"Monitor breathing continuously", "/images/poison/alcohol_monitor.png"}
                });

            seedEmergency(repository, "Food Poisoning", "poisoning", Severity.MEDIUM,
                "Illness from contaminated food",
                new String[][]{
                    {"Rest and avoid solid foods initially", "/images/poison/food_rest.png"},
                    {"Drink clear fluids to prevent dehydration", "/images/poison/food_fluids.png"},
                    {"Avoid dairy, caffeine, and alcohol", "/images/poison/food_avoid.png"},
                    {"Start with bland foods when ready (BRAT diet)", "/images/poison/food_brat.png"},
                    {"Seek medical help if bloody stool, high fever, or severe dehydration", "/images/poison/food_medical.png"},
                    {"Save sample of suspected food if possible", "/images/poison/food_save.png"}
                });

            // ==================== ENVIRONMENTAL EMERGENCIES ====================
            seedEmergency(repository, "Heat Stroke", "environmental", Severity.CRITICAL,
                "Life-threatening overheating of the body",
                new String[][]{
                    {"Recognize heat stroke: Body temperature above 103°F, hot red dry skin (no sweating), rapid strong pulse, confusion, slurred speech, unconsciousness. This is life-threatening", "/images/environmental/heatstroke_recognize.png"},
                    {"Call 911 immediately: State 'heat stroke emergency.' This is a medical emergency - brain damage and death can occur within minutes without treatment", "/images/environmental/heatstroke_call.png"},
                    {"Move to cool environment: Get person to shade, air-conditioned building, or cooled vehicle immediately. Remove from sun and heat source", "/images/environmental/heatstroke_move.png"},
                    {"Remove excess clothing: Take off as much clothing as possible. Remove hats, shoes, socks, outer layers. Expose skin for cooling", "/images/environmental/heatstroke_clothing.png"},
                    {"Cool rapidly and aggressively: Immerse in cold water if possible (tub, pool, lake). If not, spray with cool water and fan continuously. Pack ice around neck, armpits, groin", "/images/environmental/heatstroke_cool.png"},
                    {"Focus on high blood-flow areas: Place ice packs or cold wet cloths on neck, armpits, and groin where blood vessels are close to surface. This cools blood faster", "/images/environmental/heatstroke_focus.png"},
                    {"Do NOT give fluids if altered mental status: If person is confused, vomiting, or unconscious, do not give anything by mouth. They may choke", "/images/environmental/heatstroke_nofluids.png"},
                    {"Continue cooling until EMS arrives: Do not stop cooling measures. Monitor breathing and be ready for CPR if person becomes unresponsive and stops breathing", "/images/environmental/heatstroke_continue.png"}
                });

            seedEmergency(repository, "Heat Exhaustion", "environmental", Severity.MEDIUM,
                "Overheating with profuse sweating and weakness",
                new String[][]{
                    {"Move person to cool area and have them lie down", "/images/environmental/exhaustion_move.png"},
                    {"Remove excess clothing", "/images/environmental/exhaustion_clothing.png"},
                    {"Cool with wet cloths or fan", "/images/environmental/exhaustion_cool.png"},
                    {"Give cool water or sports drink if conscious", "/images/environmental/exhaustion_drink.png"},
                    {"Monitor for worsening symptoms", "/images/environmental/exhaustion_monitor.png"},
                    {"Call 911 if symptoms worsen or don't improve in 30 minutes", "/images/environmental/exhaustion_call.png"}
                });

            seedEmergency(repository, "Hypothermia", "environmental", Severity.HIGH,
                "Dangerously low body temperature",
                new String[][]{
                    {"Recognize hypothermia: Shivering (may stop in severe cases), confusion, slurred speech, drowsiness, weak pulse, clumsy movements. Core temperature below 95°F is hypothermia", "/images/environmental/hypo_recognize.png"},
                    {"Call 911 immediately: Severe hypothermia is life-threatening. Heart can stop if person is rewarmed too quickly or handled roughly", "/images/environmental/hypo_call.png"},
                    {"Move to warm environment: Get person out of cold, wind, and wet conditions. Move gently - rough handling can trigger cardiac arrest in severe hypothermia", "/images/environmental/hypo_shelter.png"},
                    {"Remove wet clothing: Cut off wet clothes if needed. Dry the person gently. Do not rub skin - this can cause cardiac arrhythmias", "/images/environmental/hypo_dry.png"},
                    {"Insulate from ground: Place blankets, sleeping bag, or dry clothing underneath person. Ground contact causes rapid heat loss", "/images/environmental/hypo_insulate.png"},
                    {"Warm the core first: Wrap in blankets focusing on head, neck, chest, and groin. Use your body heat if no other heat source. Add chemical heat packs wrapped in cloth", "/images/environmental/hypo_warm.png"},
                    {"Warm beverages if conscious and alert: Give warm (not hot) sweet drinks if person can swallow safely. No alcohol - it increases heat loss", "/images/environmental/hypo_drink.png"},
                    {"Handle very gently: Do not massage limbs or apply direct heat to arms/legs. Cold blood returning to heart can cause cardiac arrest. Wait for EMS to rewarm", "/images/environmental/hypo_gentle.png"}
                });

            seedEmergency(repository, "Frostbite", "environmental", Severity.HIGH,
                "Tissue freezing from cold exposure",
                new String[][]{
                    {"Get person to warm area", "/images/environmental/frost_warm.png"},
                    {"Do not rub affected area - this causes more damage", "/images/environmental/frost_norub.png"},
                    {"Remove wet clothing and jewelry", "/images/environmental/frost_remove.png"},
                    {"Immerse in warm (not hot) water 100-104°F for 20-30 minutes", "/images/environmental/frost_immerse.png"},
                    {"Apply loose sterile bandages between fingers/toes", "/images/environmental/frost_bandage.png"},
                    {"Seek medical attention - do not rewarm if refreezing is possible", "/images/environmental/frost_medical.png"}
                });

            seedEmergency(repository, "Lightning Strike", "environmental", Severity.CRITICAL,
                "Person struck by lightning",
                new String[][]{
                    {"Call 911 immediately", "/images/environmental/lightning_call.png"},
                    {"Move to safe area if lightning continues - it's safe to touch victim", "/images/environmental/lightning_safe.png"},
                    {"Check for breathing and pulse - begin CPR if needed", "/images/environmental/lightning_cpr.png"},
                    {"Check for and treat burns", "/images/environmental/lightning_burns.png"},
                    {"Look for entrance and exit wounds", "/images/environmental/lightning_wounds.png"},
                    {"Monitor for cardiac problems", "/images/environmental/lightning_cardiac.png"}
                });

            // ==================== BREATHING EMERGENCIES ====================
            seedEmergency(repository, "Asthma Attack", "respiratory", Severity.HIGH,
                "Acute asthma episode with breathing difficulty",
                new String[][]{
                    {"Recognize severe asthma attack: Extreme difficulty breathing, inability to speak full sentences, lips or fingernails turning blue, chest retracting with each breath", "/images/respiratory/asthma_recognize.png"},
                    {"Help person sit upright: Sitting up or leaning slightly forward with hands on knees ('tripod position') makes breathing easier. Never lay them down", "/images/respiratory/asthma_sit.png"},
                    {"Stay calm and reassure: Panic worsens asthma. Speak calmly, make eye contact, coach slow breathing. Your calmness helps them stay calm", "/images/respiratory/asthma_calm.png"},
                    {"Locate rescue inhaler (blue): Help find their quick-relief inhaler (albuterol/salbutamol). Most asthmatics carry one. Check pockets, purse, backpack", "/images/respiratory/asthma_find.png"},
                    {"Assist with inhaler use: Shake inhaler. Have them breathe out. Put mouthpiece in mouth, press canister while breathing in slowly. Hold breath 10 seconds if able", "/images/respiratory/asthma_inhaler.png"},
                    {"Give 4 puffs with 4 breaths between: Allow 4 normal breaths between each puff. This allows medication to reach deep into lungs. Watch for improvement", "/images/respiratory/asthma_puffs.png"},
                    {"Call 911 if: No improvement after 4 puffs, person cannot speak, lips/nails are blue, they are exhausted from breathing effort, or they indicate this is worse than usual", "/images/respiratory/asthma_call.png"},
                    {"Continue treatment until help arrives: Can repeat 4 puffs every 4 minutes if needed. Keep person upright and calm. Monitor breathing continuously", "/images/respiratory/asthma_repeat.png"}
                });

            seedEmergency(repository, "Hyperventilation", "respiratory", Severity.MEDIUM,
                "Rapid breathing often triggered by anxiety",
                new String[][]{
                    {"Stay calm and help person relax", "/images/respiratory/hyper_calm.png"},
                    {"Have person breathe slowly through pursed lips", "/images/respiratory/hyper_pursed.png"},
                    {"Count breaths: inhale 4 counts, exhale 4 counts", "/images/respiratory/hyper_count.png"},
                    {"Reassure person that they are not having a heart attack", "/images/respiratory/hyper_reassure.png"},
                    {"Avoid breathing into a bag unless directed by medical professional", "/images/respiratory/hyper_nobag.png"},
                    {"Seek medical help if person becomes more distressed", "/images/respiratory/hyper_medical.png"}
                });

            // ==================== DIABETIC EMERGENCIES ====================
            seedEmergency(repository, "Diabetic Emergency Low Blood Sugar", "medical", Severity.HIGH,
                "Hypoglycemia requiring immediate sugar intake",
                new String[][]{
                    {"Recognize signs: shakiness, confusion, sweating, hunger", "/images/medical/diabetic_low_signs.png"},
                    {"Give fast-acting sugar: juice, candy, glucose tablets", "/images/medical/diabetic_low_sugar.png"},
                    {"Have person sit down safely", "/images/medical/diabetic_low_sit.png"},
                    {"Wait 15 minutes and recheck symptoms", "/images/medical/diabetic_low_wait.png"},
                    {"Give more sugar if symptoms persist", "/images/medical/diabetic_low_more.png"},
                    {"Call 911 if person becomes unconscious", "/images/medical/diabetic_low_call.png"}
                });

            seedEmergency(repository, "Diabetic Emergency High Blood Sugar", "medical", Severity.HIGH,
                "Hyperglycemia requiring medical attention",
                new String[][]{
                    {"Recognize signs: extreme thirst, frequent urination, fruity breath", "/images/medical/diabetic_high_signs.png"},
                    {"Give water if person is conscious", "/images/medical/diabetic_high_water.png"},
                    {"Help person check blood sugar if they have meter", "/images/medical/diabetic_high_check.png"},
                    {"Call 911 if confused, vomiting, or very ill", "/images/medical/diabetic_high_call.png"},
                    {"Help person take insulin if they are able", "/images/medical/diabetic_high_insulin.png"},
                    {"Monitor for worsening symptoms", "/images/medical/diabetic_high_monitor.png"}
                });

            // ==================== SEIZURES ====================
            seedEmergency(repository, "Seizure", "neurological", Severity.HIGH,
                "Uncontrolled electrical activity in brain",
                new String[][]{
                    {"Stay calm and note the time: Start timing the seizure immediately. Duration is critical information for EMS. Most seizures last 30 seconds to 2 minutes", "/images/neuro/seizure_time.png"},
                    {"Protect from injury: Clear away furniture, sharp objects, anything hard. If standing, guide person gently to floor. Place something soft under their head", "/images/neuro/seizure_clear.png"},
                    {"Do NOT restrain: Never hold the person down or try to stop the movements. This can cause injury. The seizure must run its course", "/images/neuro/seizure_restrain.png"},
                    {"Do NOT put anything in mouth: The person cannot swallow their tongue. Putting objects in mouth can break teeth, injure jaw, or cause choking", "/images/neuro/seizure_mouth.png"},
                    {"Turn on side (recovery position): Once convulsions stop, turn person on their side. This keeps airway clear and allows fluids to drain. Tilt head back slightly", "/images/neuro/seizure_side.png"},
                    {"Call 911 if: Seizure lasts more than 5 minutes, person doesn't regain consciousness, another seizure follows, person is injured, pregnant, or diabetic, or this is their first seizure", "/images/neuro/seizure_call.png"},
                    {"Stay until fully alert: Person may be confused, sleepy, or agitated after seizure (postictal state). Stay calm, speak softly, explain what happened. Do not give food/water until fully alert", "/images/neuro/seizure_after.png"},
                    {"Loosen tight clothing: Undo collars, ties, belts. Check breathing regularly. If breathing doesn't resume after seizure stops, begin CPR", "/images/neuro/seizure_loosen.png"}
                });

            seedEmergency(repository, "Febrile Seizure", "neurological", Severity.MEDIUM,
                "Seizure in children caused by fever",
                new String[][]{
                    {"Stay calm - most febrile seizures stop on their own", "/images/neuro/febrile_calm.png"},
                    {"Place child on side on safe surface", "/images/neuro/febrile_side.png"},
                    {"Do not restrain or put anything in mouth", "/images/neuro/febrile_dont.png"},
                    {"Time the seizure", "/images/neuro/febrile_time.png"},
                    {"Call 911 if seizure lasts more than 5 minutes", "/images/neuro/febrile_call.png"},
                    {"After seizure, cool child gradually and see doctor", "/images/neuro/febrile_cool.png"}
                });

            // ==================== STROKE ====================
            seedEmergency(repository, "Stroke", "neurological", Severity.CRITICAL,
                "Brain attack - use FAST to identify",
                new String[][]{
                    {"Use FAST assessment: F-Face drooping (ask to smile, is one side drooping?), A-Arm weakness (ask to raise both arms, does one drift down?), S-Speech difficulty (slurred, confused, unable to repeat simple phrase?), T-Time to call 911", "/images/neuro/stroke_fast.png"},
                    {"Call 911 immediately: State 'possible stroke.' Time is critical - there is a narrow window for clot-busting treatment. Every minute matters for brain survival", "/images/neuro/stroke_call.png"},
                    {"Note the exact time symptoms started: This is crucial information. Treatment options depend on how long since symptom onset. Ask bystanders if you didn't witness it", "/images/neuro/stroke_time.png"},
                    {"Keep person still and calm: Have them lie down with head slightly elevated (15-30 degrees). Turn on side if vomiting. Do not allow them to walk or move unnecessarily", "/images/neuro/stroke_position.png"},
                    {"Do NOT give anything by mouth: No food, water, or medications (including aspirin - unlike heart attack, stroke may be bleeding not a clot). Person may have difficulty swallowing", "/images/neuro/stroke_nofood.png"},
                    {"Loosen restrictive clothing: Undo collar, tie, bra, belt. This helps with breathing and blood flow. Keep person comfortable but still", "/images/neuro/stroke_loosen.png"},
                    {"Monitor breathing closely: Stroke can affect breathing. If person becomes unresponsive and stops breathing normally, begin CPR immediately", "/images/neuro/stroke_monitor.png"},
                    {"Note all symptoms: Record what you observe - weakness on which side, speech problems, vision issues, confusion level. This helps medical team assess and treat", "/images/neuro/stroke_record.png"}
                });

            // ==================== EYE INJURIES ====================
            seedEmergency(repository, "Eye Injury Chemical", "eye", Severity.HIGH,
                "Chemical splash in eye",
                new String[][]{
                    {"Flush eye immediately with clean water for 15-20 minutes", "/images/eye/chemical_flush.png"},
                    {"Hold eyelids open while flushing", "/images/eye/chemical_hold.png"},
                    {"Remove contact lenses if present", "/images/eye/chemical_contacts.png"},
                    {"Call Poison Control or 911", "/images/eye/chemical_call.png"},
                    {"Do not rub the eye", "/images/eye/chemical_norub.png"},
                    {"Cover with loose bandage and seek emergency care", "/images/eye/chemical_cover.png"}
                });

            seedEmergency(repository, "Eye Injury Object", "eye", Severity.MEDIUM,
                "Foreign object in eye",
                new String[][]{
                    {"Do not rub the eye", "/images/eye/object_norub.png"},
                    {"Try blinking to produce tears to flush object", "/images/eye/object_blink.png"},
                    {"Gently pull upper lid over lower lid", "/images/eye/object_pull.png"},
                    {"Flush with clean water if object doesn't come out", "/images/eye/object_flush.png"},
                    {"Do not attempt to remove embedded objects", "/images/eye/object_notouch.png"},
                    {"Seek medical attention if object remains", "/images/eye/object_medical.png"}
                });

            // ==================== PSYCHOLOGICAL EMERGENCIES ====================
            seedEmergency(repository, "Panic Attack", "mental-health", Severity.MEDIUM,
                "Acute anxiety episode with physical symptoms",
                new String[][]{
                    {"Stay calm and reassure person they are safe", "/images/mental/panic_calm.png"},
                    {"Guide them to a quiet area", "/images/mental/panic_quiet.png"},
                    {"Help with slow deep breathing: inhale 4 seconds, exhale 4 seconds", "/images/mental/panic_breathe.png"},
                    {"Ground them by focusing on 5 things they can see", "/images/mental/panic_ground.png"},
                    {"Stay with them until symptoms pass", "/images/mental/panic_stay.png"},
                    {"Suggest professional help if attacks are frequent", "/images/mental/panic_help.png"}
                });

            seedEmergency(repository, "Fainting", "neurological", Severity.MEDIUM,
                "Brief loss of consciousness",
                new String[][]{
                    {"Help person lie down with legs elevated", "/images/neuro/faint_position.png"},
                    {"Loosen tight clothing", "/images/neuro/faint_loosen.png"},
                    {"Check for breathing and pulse", "/images/neuro/faint_check.png"},
                    {"If they don't regain consciousness in 1 minute, call 911", "/images/neuro/faint_call.png"},
                    {"When conscious, have them stay lying down for several minutes", "/images/neuro/faint_rest.png"},
                    {"Give water when fully alert", "/images/neuro/faint_water.png"}
                });

            // ==================== BITES & STINGS ====================
            seedEmergency(repository, "Snake Bite", "bites", Severity.HIGH,
                "Venomous or unknown snake bite",
                new String[][]{
                    {"Call 911 immediately", "/images/bites/snake_call.png"},
                    {"Keep person calm and still", "/images/bites/snake_calm.png"},
                    {"Remove jewelry near bite before swelling", "/images/bites/snake_jewelry.png"},
                    {"Keep bite below heart level", "/images/bites/snake_position.png"},
                    {"Do not cut, suck, or apply ice to bite", "/images/bites/snake_dont.png"},
                    {"Try to remember snake's appearance for identification", "/images/bites/snake_identify.png"}
                });

            seedEmergency(repository, "Spider Bite", "bites", Severity.MEDIUM,
                "Venomous spider bite",
                new String[][]{
                    {"Clean bite area with soap and water", "/images/bites/spider_clean.png"},
                    {"Apply ice wrapped in cloth", "/images/bites/spider_ice.png"},
                    {"Elevate the affected limb", "/images/bites/spider_elevate.png"},
                    {"Take photo of spider if safely possible", "/images/bites/spider_photo.png"},
                    {"Monitor for severe symptoms: muscle cramps, sweating, difficulty breathing", "/images/bites/spider_monitor.png"},
                    {"Seek medical attention if symptoms worsen", "/images/bites/spider_medical.png"}
                });

            seedEmergency(repository, "Animal Bite", "bites", Severity.MEDIUM,
                "Dog, cat, or other animal bite",
                new String[][]{
                    {"Control bleeding with direct pressure", "/images/bites/animal_pressure.png"},
                    {"Wash wound thoroughly with soap and water for 5 minutes", "/images/bites/animal_wash.png"},
                    {"Apply antibiotic ointment and sterile bandage", "/images/bites/animal_bandage.png"},
                    {"Get information about the animal if possible", "/images/bites/animal_info.png"},
                    {"Seek medical attention - may need tetanus shot or rabies evaluation", "/images/bites/animal_medical.png"},
                    {"Report bite to local animal control", "/images/bites/animal_report.png"}
                });

            seedEmergency(repository, "Tick Bite", "bites", Severity.LOW,
                "Tick attachment requiring removal",
                new String[][]{
                    {"Use fine-tipped tweezers to grasp tick close to skin", "/images/bites/tick_tweezers.png"},
                    {"Pull upward with steady, even pressure", "/images/bites/tick_pull.png"},
                    {"Do not twist or jerk the tick", "/images/bites/tick_notwist.png"},
                    {"Clean area with rubbing alcohol or soap and water", "/images/bites/tick_clean.png"},
                    {"Save tick in container for identification", "/images/bites/tick_save.png"},
                    {"Monitor for rash or fever for 30 days", "/images/bites/tick_monitor.png"}
                });

            seedEmergency(repository, "Jellyfish Sting", "bites", Severity.MEDIUM,
                "Marine creature sting",
                new String[][]{
                    {"Get out of water immediately", "/images/bites/jelly_exit.png"},
                    {"Rinse with vinegar for 30 seconds", "/images/bites/jelly_vinegar.png"},
                    {"Remove tentacles with tweezers (not bare hands)", "/images/bites/jelly_remove.png"},
                    {"Immerse in hot water (110-113°F) for 20-45 minutes", "/images/bites/jelly_hot.png"},
                    {"Take pain medication if needed", "/images/bites/jelly_pain.png"},
                    {"Seek medical help for severe reactions", "/images/bites/jelly_medical.png"}
                });

            // ==================== PREGNANCY EMERGENCIES ====================
            seedEmergency(repository, "Emergency Childbirth", "pregnancy", Severity.CRITICAL,
                "Delivering a baby outside hospital",
                new String[][]{
                    {"Call 911 immediately", "/images/pregnancy/birth_call.png"},
                    {"Have mother lie on back with knees bent", "/images/pregnancy/birth_position.png"},
                    {"Wash hands and gather clean towels", "/images/pregnancy/birth_prepare.png"},
                    {"Support baby's head as it emerges - do not pull", "/images/pregnancy/birth_support.png"},
                    {"Clear baby's airway and keep warm", "/images/pregnancy/birth_clear.png"},
                    {"Do not cut umbilical cord - wait for paramedics", "/images/pregnancy/birth_cord.png"}
                });

            seedEmergency(repository, "Miscarriage", "pregnancy", Severity.HIGH,
                "Pregnancy loss requiring medical attention",
                new String[][]{
                    {"Call 911 if heavy bleeding or severe pain", "/images/pregnancy/miscarriage_call.png"},
                    {"Have woman lie down comfortably", "/images/pregnancy/miscarriage_rest.png"},
                    {"Save any tissue passed for medical examination", "/images/pregnancy/miscarriage_save.png"},
                    {"Monitor for signs of shock", "/images/pregnancy/miscarriage_shock.png"},
                    {"Provide emotional support", "/images/pregnancy/miscarriage_support.png"},
                    {"Transport to hospital or call for emergency care", "/images/pregnancy/miscarriage_transport.png"}
                });

            // ==================== DENTAL EMERGENCIES ====================
            seedEmergency(repository, "Knocked Out Tooth", "dental", Severity.MEDIUM,
                "Avulsed permanent tooth requiring reimplantation",
                new String[][]{
                    {"Find the tooth and handle by crown only (not root)", "/images/dental/tooth_find.png"},
                    {"Rinse gently with water if dirty - do not scrub", "/images/dental/tooth_rinse.png"},
                    {"Try to reinsert tooth into socket", "/images/dental/tooth_reinsert.png"},
                    {"If cannot reinsert, place in milk or saliva", "/images/dental/tooth_milk.png"},
                    {"Get to dentist or ER within 30 minutes if possible", "/images/dental/tooth_urgent.png"},
                    {"Time is critical - faster treatment = better outcome", "/images/dental/tooth_time.png"}
                });

            seedEmergency(repository, "Severe Toothache", "dental", Severity.LOW,
                "Acute dental pain requiring relief",
                new String[][]{
                    {"Rinse mouth with warm salt water", "/images/dental/toothache_rinse.png"},
                    {"Floss gently to remove any trapped food", "/images/dental/toothache_floss.png"},
                    {"Take over-the-counter pain medication", "/images/dental/toothache_pain.png"},
                    {"Apply cold compress to outside of cheek", "/images/dental/toothache_cold.png"},
                    {"Do not place aspirin directly on gums", "/images/dental/toothache_noaspirin.png"},
                    {"See dentist as soon as possible", "/images/dental/toothache_dentist.png"}
                });

            // ==================== ADDITIONAL CRITICAL EMERGENCIES ====================
            seedEmergency(repository, "Shock", "medical", Severity.CRITICAL,
                "Life-threatening circulatory failure",
                new String[][]{
                    {"Call 911 immediately", "/images/medical/shock_call.png"},
                    {"Lay person flat with legs elevated 12 inches", "/images/medical/shock_position.png"},
                    {"Do not move if spinal injury suspected", "/images/medical/shock_nomove.png"},
                    {"Cover with blanket to maintain body temperature", "/images/medical/shock_warm.png"},
                    {"Do not give food or water", "/images/medical/shock_nofood.png"},
                    {"Monitor breathing and begin CPR if needed", "/images/medical/shock_monitor.png"}
                });

            seedEmergency(repository, "Appendicitis", "medical", Severity.HIGH,
                "Inflamed appendix requiring surgery",
                new String[][]{
                    {"Recognize symptoms: pain starting near navel moving to lower right", "/images/medical/appendix_symptoms.png"},
                    {"Call 911 or go to ER immediately", "/images/medical/appendix_call.png"},
                    {"Do not eat or drink anything", "/images/medical/appendix_nofood.png"},
                    {"Do not take laxatives or pain medication", "/images/medical/appendix_nomeds.png"},
                    {"Lie still in comfortable position", "/images/medical/appendix_rest.png"},
                    {"Monitor for fever and worsening pain", "/images/medical/appendix_monitor.png"}
                });

            seedEmergency(repository, "Severe Dehydration", "medical", Severity.HIGH,
                "Critical fluid loss requiring intervention",
                new String[][]{
                    {"Recognize signs: extreme thirst, dark urine, dizziness, confusion", "/images/medical/dehydrate_signs.png"},
                    {"Call 911 if person is confused or unconscious", "/images/medical/dehydrate_call.png"},
                    {"Give small sips of water or oral rehydration solution", "/images/medical/dehydrate_fluids.png"},
                    {"Move to cool environment", "/images/medical/dehydrate_cool.png"},
                    {"Have person lie down with legs elevated", "/images/medical/dehydrate_position.png"},
                    {"Seek medical attention for severe cases", "/images/medical/dehydrate_medical.png"}
                });

            seedEmergency(repository, "Abdominal Pain Severe", "medical", Severity.HIGH,
                "Acute abdominal emergency",
                new String[][]{
                    {"Call 911 if pain is severe or with fever, vomiting blood", "/images/medical/abdomen_call.png"},
                    {"Do not eat or drink anything", "/images/medical/abdomen_nofood.png"},
                    {"Do not take pain medication until evaluated", "/images/medical/abdomen_nomeds.png"},
                    {"Lie in position of comfort", "/images/medical/abdomen_rest.png"},
                    {"Monitor for changes in symptoms", "/images/medical/abdomen_monitor.png"},
                    {"Go to ER if symptoms persist or worsen", "/images/medical/abdomen_er.png"}
                });

            seedEmergency(repository, "Internal Bleeding", "trauma", Severity.CRITICAL,
                "Hidden hemorrhage requiring emergency care",
                new String[][]{
                    {"Call 911 immediately", "/images/trauma/internal_call.png"},
                    {"Recognize signs: dizziness, pale skin, rapid pulse, tender abdomen", "/images/trauma/internal_signs.png"},
                    {"Keep person lying down with legs elevated", "/images/trauma/internal_position.png"},
                    {"Do not give food or water", "/images/trauma/internal_nofood.png"},
                    {"Keep person warm and calm", "/images/trauma/internal_warm.png"},
                    {"Monitor for shock and be ready for CPR", "/images/trauma/internal_monitor.png"}
                });

            seedEmergency(repository, "Embedded Object", "trauma", Severity.HIGH,
                "Object stuck in body - do not remove",
                new String[][]{
                    {"Call 911 immediately", "/images/trauma/embedded_call.png"},
                    {"Do not remove the object", "/images/trauma/embedded_noremove.png"},
                    {"Stabilize object with bulky dressings around it", "/images/trauma/embedded_stabilize.png"},
                    {"Control bleeding around the object", "/images/trauma/embedded_bleeding.png"},
                    {"Keep person still and calm", "/images/trauma/embedded_calm.png"},
                    {"Monitor for shock until help arrives", "/images/trauma/embedded_shock.png"}
                });

            logger.info("Successfully seeded {} emergencies", repository.count());
        };
    }

    private String buildImageUrl(String category, String title) {
        String categorySlug = category.toLowerCase();
        String titleSlug = title.toLowerCase()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");
        return "/images/" + categorySlug + "/" + titleSlug + ".jpg";
    }

    private void seedEmergency(EmergencyRepository repository, String name, String category,
                               Severity severity, String description, String[][] steps) {
        String imageUrl = buildImageUrl(category, name);
        Emergency emergency = new Emergency(name, category, severity, description, imageUrl);

        for (int i = 0; i < steps.length; i++) {
            emergency.addStep(i + 1, steps[i][0], steps[i][1]);
        }

        repository.save(emergency);
    }
}
