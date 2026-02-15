/**
 * QuestionBank.js - CPR Training Question Pools
 *
 * Contains categorized question pools for adult, child, infant CPR
 * and a mixed pool combining all categories.
 *
 * Question format:
 * {
 *   id: string,           // Unique identifier (e.g., "adult-001")
 *   pool: string,         // Category: "adult" | "child" | "infant"
 *   q: string,            // Question text
 *   options: string[],    // 4 answer options
 *   answer: number,       // Index of correct option (0-based)
 *   explanation: string   // Why this answer is correct
 * }
 */

// Adult CPR Questions (20+ questions)
const adultQuestions = [
    {
        id: 'adult-001',
        pool: 'adult',
        q: 'What is the recommended compression rate for adult CPR?',
        options: ['60-80/min', '100-120/min', '140-160/min', '80-90/min'],
        answer: 1,
        explanation: 'AHA guidelines recommend 100-120 compressions per minute for adults.'
    },
    {
        id: 'adult-002',
        pool: 'adult',
        q: 'Compression depth for an adult should be:',
        options: ['About 1 inch', 'At least 2 inches (5 cm)', 'Over 3 inches', 'Barely press'],
        answer: 1,
        explanation: 'Adult compressions should be at least 2 inches (5 cm) deep but not more than 2.4 inches.'
    },
    {
        id: 'adult-003',
        pool: 'adult',
        q: 'Where do you place your hands for adult compressions?',
        options: ['Lower abdomen', 'Center of the chest on the sternum', 'Left side of chest', 'Over the stomach'],
        answer: 1,
        explanation: 'Place the heel of your hand on the center of the chest, on the lower half of the sternum.'
    },
    {
        id: 'adult-004',
        pool: 'adult',
        q: 'Ratio for single rescuer adult CPR with breaths is:',
        options: ['15:2', '5:1', '30:2', '20:2'],
        answer: 2,
        explanation: 'The ratio is 30 compressions to 2 rescue breaths for single rescuer adult CPR.'
    },
    {
        id: 'adult-005',
        pool: 'adult',
        q: 'If unwilling/unable to give breaths, you should:',
        options: ['Stop CPR', 'Do compressions only', 'Wait for EMS', 'Give 1 breath per 5 compressions'],
        answer: 1,
        explanation: 'Hands-only CPR (compression-only) is effective and recommended if you cannot give breaths.'
    },
    {
        id: 'adult-006',
        pool: 'adult',
        q: 'For a conscious choking adult, you should:',
        options: ['Slap their back lightly', 'Perform abdominal thrusts (Heimlich)', 'Give water', 'Lay them down'],
        answer: 1,
        explanation: 'Abdominal thrusts (Heimlich maneuver) can dislodge the obstruction in conscious adults.'
    },
    {
        id: 'adult-007',
        pool: 'adult',
        q: 'Where do you place your fist for abdominal thrusts?',
        options: ['On the chest', 'Just above the navel', 'On the throat', 'On the back'],
        answer: 1,
        explanation: 'Place your fist just above the navel, below the ribcage, thumb side in.'
    },
    {
        id: 'adult-008',
        pool: 'adult',
        q: 'If a choking person becomes unconscious:',
        options: ['Continue thrusts', 'Start CPR', 'Give water', 'Wait for EMS'],
        answer: 1,
        explanation: 'Begin CPR immediately if the person becomes unconscious, checking for visible objects before breaths.'
    },
    {
        id: 'adult-009',
        pool: 'adult',
        q: 'Signs of heart attack include:',
        options: ['Stomach ache only', 'Chest pain/pressure, shortness of breath, arm/jaw pain', 'Headache only', 'Leg pain only'],
        answer: 1,
        explanation: 'Heart attack symptoms include chest discomfort, shortness of breath, and pain radiating to arm, jaw, or back.'
    },
    {
        id: 'adult-010',
        pool: 'adult',
        q: 'For suspected heart attack:',
        options: ['Wait it out', 'Call EMS, have person rest, chew aspirin if not allergic', 'Exercise', 'Take a nap'],
        answer: 1,
        explanation: 'Call 911, have the person rest, and give aspirin (if not allergic) to help with clot prevention.'
    },
    {
        id: 'adult-011',
        pool: 'adult',
        q: 'When should you use an AED?',
        options: ['For conscious person', 'For unresponsive person not breathing normally', 'For broken bones', 'For choking'],
        answer: 1,
        explanation: 'Use an AED on unresponsive victims who are not breathing or only gasping.'
    },
    {
        id: 'adult-012',
        pool: 'adult',
        q: 'Before AED shock:',
        options: ['Continue compressions', 'Make sure no one is touching victim', 'Give rescue breaths', 'Check pulse'],
        answer: 1,
        explanation: 'Clear the victim before shocking - ensure no one is touching them to prevent injury.'
    },
    {
        id: 'adult-013',
        pool: 'adult',
        q: 'After AED delivers shock:',
        options: ['Wait 5 minutes', 'Immediately resume CPR starting with compressions', 'Check pulse for 1 minute', 'Give 10 breaths'],
        answer: 1,
        explanation: 'Resume CPR immediately after shock, starting with chest compressions.'
    },
    {
        id: 'adult-014',
        pool: 'adult',
        q: 'FAST for stroke stands for:',
        options: ['Feel, Ask, Stop, Time', 'Face drooping, Arm weakness, Speech difficulty, Time to call', 'First, Assess, Stabilize, Transport', 'Fast Action Saves Time'],
        answer: 1,
        explanation: 'FAST helps identify stroke: Face drooping, Arm weakness, Speech difficulty, Time to call 911.'
    },
    {
        id: 'adult-015',
        pool: 'adult',
        q: 'If you suspect stroke:',
        options: ['Wait to see if it improves', 'Call EMS immediately, note time symptoms started', 'Give aspirin first', 'Lay them down'],
        answer: 1,
        explanation: 'Call 911 immediately and note the time symptoms started - this is critical for treatment decisions.'
    },
    {
        id: 'adult-016',
        pool: 'adult',
        q: 'First step in any emergency:',
        options: ['Move the victim', 'Ensure scene safety', 'Give CPR', 'Call family'],
        answer: 1,
        explanation: 'Always ensure the scene is safe before approaching - you cannot help if you become a victim.'
    },
    {
        id: 'adult-017',
        pool: 'adult',
        q: 'When calling EMS, provide:',
        options: ['Just your name', 'Location, what happened, number of victims, condition', 'Only location', 'Nothing, just hang up'],
        answer: 1,
        explanation: 'Give dispatcher location, nature of emergency, number of victims, and conditions observed.'
    },
    {
        id: 'adult-018',
        pool: 'adult',
        q: 'Recovery position is used for:',
        options: ['Broken leg', 'Unconscious but breathing person', 'Choking victim', 'CPR'],
        answer: 1,
        explanation: 'The recovery position keeps the airway clear for unconscious but breathing victims.'
    },
    {
        id: 'adult-019',
        pool: 'adult',
        q: 'Signs of shock include:',
        options: ['Warm dry skin', 'Pale/cool/clammy skin, rapid pulse, confusion', 'High energy', 'Hunger'],
        answer: 1,
        explanation: 'Shock symptoms include pale, cool, clammy skin, rapid weak pulse, and altered mental status.'
    },
    {
        id: 'adult-020',
        pool: 'adult',
        q: 'To treat shock:',
        options: ['Give water', 'Lay person down, elevate legs, keep warm', 'Have them stand', 'Give food'],
        answer: 1,
        explanation: 'Lay the person down, elevate legs 12 inches (if no spinal injury suspected), and keep them warm.'
    }
];

// Child CPR Questions (15+ questions)
const childQuestions = [
    {
        id: 'child-001',
        pool: 'child',
        q: 'Compression depth for a child:',
        options: ['About 1/3 chest depth (~2 inches)', '1 inch', '3 inches', 'Barely press'],
        answer: 0,
        explanation: 'Child compressions should be about 1/3 the depth of the chest, approximately 2 inches.'
    },
    {
        id: 'child-002',
        pool: 'child',
        q: 'Single rescuer ratio for child CPR:',
        options: ['15:2', '30:2', '20:2', '5:1'],
        answer: 1,
        explanation: 'Single rescuer child CPR uses the same 30:2 ratio as adult CPR.'
    },
    {
        id: 'child-003',
        pool: 'child',
        q: 'For child CPR, you can use:',
        options: ['Two fingers only', 'One or two hands depending on child size', 'Fist only', 'No hands'],
        answer: 1,
        explanation: 'Use one or two hands for child compressions based on child size and rescuer hand size.'
    },
    {
        id: 'child-004',
        pool: 'child',
        q: 'Two-rescuer child CPR ratio is:',
        options: ['30:2', '15:2', '10:1', '5:1'],
        answer: 1,
        explanation: 'With two rescuers, child CPR uses a 15:2 compression to ventilation ratio.'
    },
    {
        id: 'child-005',
        pool: 'child',
        q: 'A child for CPR purposes is defined as:',
        options: ['Under 1 year', 'Age 1 year to puberty', 'Over 8 years', 'Any teenager'],
        answer: 1,
        explanation: 'For CPR, a child is from age 1 to puberty (around 12-14 years).'
    },
    {
        id: 'child-006',
        pool: 'child',
        q: 'For a choking child who cannot cough or speak:',
        options: ['Give water', 'Perform abdominal thrusts', 'Pat on back gently', 'Wait for help'],
        answer: 1,
        explanation: 'Perform abdominal thrusts (Heimlich maneuver) for children with severe airway obstruction.'
    },
    {
        id: 'child-007',
        pool: 'child',
        q: 'If alone with unresponsive child, first:',
        options: ['Call 911 immediately', 'Give 2 minutes of CPR then call', 'Drive to hospital', 'Wait for someone'],
        answer: 1,
        explanation: 'For children, give 2 minutes of CPR first before calling 911 if alone (call first if cardiac cause suspected).'
    },
    {
        id: 'child-008',
        pool: 'child',
        q: 'AED pads for children ages 1-8:',
        options: ['Never use AED on children', 'Use pediatric pads if available', 'Use adult pads only', 'AED is automatic'],
        answer: 1,
        explanation: 'Use pediatric pads if available; if not, use adult pads but ensure they do not touch.'
    },
    {
        id: 'child-009',
        pool: 'child',
        q: 'Head tilt for child airway:',
        options: ['Extreme tilt back', 'Neutral position with slight tilt', 'No tilt needed', 'Tilt forward'],
        answer: 1,
        explanation: 'Use a neutral position with slight head tilt-chin lift to open the child airway.'
    },
    {
        id: 'child-010',
        pool: 'child',
        q: 'Signs of respiratory distress in children:',
        options: ['Normal breathing', 'Retractions, nasal flaring, grunting', 'Deep slow breaths', 'No signs visible'],
        answer: 1,
        explanation: 'Watch for retractions (skin pulling between ribs), nasal flaring, and grunting sounds.'
    },
    {
        id: 'child-011',
        pool: 'child',
        q: 'For febrile seizure in a child:',
        options: ['Put in cold water', 'Protect from injury, do not restrain, call EMS if prolonged', 'Give medication', 'Force mouth open'],
        answer: 1,
        explanation: 'Protect from injury, do not restrain, and call EMS if seizure lasts more than 5 minutes.'
    },
    {
        id: 'child-012',
        pool: 'child',
        q: 'Child drowning: after rescue, first action if not breathing:',
        options: ['Wait for EMS', 'Begin rescue breaths immediately', 'Pump stomach', 'Dry them off'],
        answer: 1,
        explanation: 'Begin rescue breathing immediately for drowning victims who are not breathing.'
    },
    {
        id: 'child-013',
        pool: 'child',
        q: 'Compression hand placement for a child:',
        options: ['Lower half of breastbone', 'Upper chest', 'Abdomen', 'Side of chest'],
        answer: 0,
        explanation: 'Place hands on the lower half of the breastbone (sternum), avoiding the xiphoid process.'
    },
    {
        id: 'child-014',
        pool: 'child',
        q: 'When performing rescue breaths on a child:',
        options: ['Blow as hard as possible', 'Give gentle breaths until chest rises', 'Skip breaths entirely', '5 quick breaths'],
        answer: 1,
        explanation: 'Give gentle breaths (about 1 second each) watching for visible chest rise.'
    },
    {
        id: 'child-015',
        pool: 'child',
        q: 'If child is responsive but struggling to breathe:',
        options: ['Start CPR', 'Keep calm, call EMS, allow comfortable position', 'Lay flat on back', 'Give water'],
        answer: 1,
        explanation: 'Keep the child calm, call EMS, and allow them to assume a comfortable position for breathing.'
    }
];

// Infant CPR Questions (15+ questions)
const infantQuestions = [
    {
        id: 'infant-001',
        pool: 'infant',
        q: 'Compression depth for infant:',
        options: ['1 inch', 'About 1/3 chest depth (~1.5 inches)', '3 inches', 'Light touch'],
        answer: 1,
        explanation: 'Infant compressions should be about 1/3 the depth of the chest, approximately 1.5 inches.'
    },
    {
        id: 'infant-002',
        pool: 'infant',
        q: 'Infant compression technique:',
        options: ['Two fingers just below nipple line', 'Full hand on chest', 'Heel of hand only', 'On abdomen'],
        answer: 0,
        explanation: 'Use two fingers (or two thumb-encircling hands technique) just below the nipple line.'
    },
    {
        id: 'infant-003',
        pool: 'infant',
        q: 'Rescue breaths for infant:',
        options: ['Seal mouth and nose, gentle puffs ~1 second', 'Hard breaths 3 seconds', 'No breaths needed', 'Breathe only through mouth'],
        answer: 0,
        explanation: 'Cover both mouth and nose, give gentle puffs lasting about 1 second each.'
    },
    {
        id: 'infant-004',
        pool: 'infant',
        q: 'For a choking infant, you should give:',
        options: ['Abdominal thrusts', '5 back blows and 5 chest thrusts', 'Water', 'Finger sweep'],
        answer: 1,
        explanation: 'Alternate 5 back blows and 5 chest thrusts until object is expelled or infant becomes unresponsive.'
    },
    {
        id: 'infant-005',
        pool: 'infant',
        q: 'Position for infant back blows:',
        options: ['Face up on lap', 'Face down on forearm, head lower than chest', 'Standing upright', 'Lying flat on floor'],
        answer: 1,
        explanation: 'Support infant face down on your forearm with head lower than chest for effective back blows.'
    },
    {
        id: 'infant-006',
        pool: 'infant',
        q: 'An infant for CPR purposes is:',
        options: ['Under 1 year old', 'Under 6 months', '1-3 years old', 'Newborn only'],
        answer: 0,
        explanation: 'An infant for CPR purposes is a baby under 1 year of age.'
    },
    {
        id: 'infant-007',
        pool: 'infant',
        q: 'Infant CPR compression rate:',
        options: ['60-80/min', '100-120/min', '80-100/min', '140-160/min'],
        answer: 1,
        explanation: 'Infant compressions should also be delivered at 100-120 per minute, same as adults.'
    },
    {
        id: 'infant-008',
        pool: 'infant',
        q: 'Single rescuer infant CPR ratio:',
        options: ['15:2', '30:2', '10:2', '5:1'],
        answer: 1,
        explanation: 'Single rescuer infant CPR uses 30:2 compression to ventilation ratio.'
    },
    {
        id: 'infant-009',
        pool: 'infant',
        q: 'Two-rescuer infant CPR ratio:',
        options: ['30:2', '15:2', '10:1', '20:2'],
        answer: 1,
        explanation: 'Two-rescuer infant CPR uses 15:2 ratio with the two thumb-encircling hands technique.'
    },
    {
        id: 'infant-010',
        pool: 'infant',
        q: 'To open infant airway:',
        options: ['Extreme head tilt', 'Neutral sniffing position (slight tilt)', 'No positioning needed', 'Flex chin to chest'],
        answer: 1,
        explanation: 'Use neutral sniffing position with minimal head tilt - overextension can block the airway.'
    },
    {
        id: 'infant-011',
        pool: 'infant',
        q: 'Where to check pulse on infant:',
        options: ['Wrist (radial)', 'Upper arm (brachial)', 'Neck (carotid)', 'Ankle'],
        answer: 1,
        explanation: 'Check the brachial pulse on the inside of the upper arm for infants.'
    },
    {
        id: 'infant-012',
        pool: 'infant',
        q: 'AED use on infants:',
        options: ['Never use AED', 'Use pediatric dose attenuator if available', 'Adult pads are fine', 'Wait for hospital'],
        answer: 1,
        explanation: 'Use AED with pediatric dose attenuator/pads if available; if not, use adult AED.'
    },
    {
        id: 'infant-013',
        pool: 'infant',
        q: 'If infant is choking but still coughing forcefully:',
        options: ['Give back blows immediately', 'Encourage continued coughing, do not interfere', 'Finger sweep', 'Start CPR'],
        answer: 1,
        explanation: 'If coughing forcefully, the infant may clear the obstruction - do not interfere.'
    },
    {
        id: 'infant-014',
        pool: 'infant',
        q: 'Signs of severe airway obstruction in infant:',
        options: ['Loud crying', 'Silent or weak cough, unable to cry, turning blue', 'Normal breathing', 'Coughing loudly'],
        answer: 1,
        explanation: 'Severe obstruction signs: cannot cry/cough effectively, silent cough, or cyanosis (turning blue).'
    },
    {
        id: 'infant-015',
        pool: 'infant',
        q: 'Chest thrust location on infant:',
        options: ['Lower abdomen', 'Just below nipple line on breastbone', 'Upper chest', 'Side of chest'],
        answer: 1,
        explanation: 'Perform chest thrusts on the breastbone, just below the nipple line.'
    }
];

// Additional general emergency questions
const generalQuestions = [
    {
        id: 'general-001',
        pool: 'adult',
        q: 'First step for severe bleeding:',
        options: ['Apply tourniquet', 'Direct pressure on wound', 'Elevate only', 'Pour water'],
        answer: 1,
        explanation: 'Apply direct pressure to the wound with a clean cloth or bandage as the first step.'
    },
    {
        id: 'general-002',
        pool: 'adult',
        q: 'If bleeding soaks through bandage:',
        options: ['Remove and replace', 'Add more bandages on top', 'Stop applying pressure', 'Pour alcohol'],
        answer: 1,
        explanation: 'Do not remove blood-soaked dressings - add more on top and continue pressure.'
    },
    {
        id: 'general-003',
        pool: 'adult',
        q: 'Use a tourniquet when:',
        options: ['For any cut', 'Severe limb bleeding not controlled by pressure', 'Minor scrapes', 'Head wounds'],
        answer: 1,
        explanation: 'Tourniquets are for life-threatening limb bleeding that cannot be controlled by direct pressure.'
    },
    {
        id: 'general-004',
        pool: 'adult',
        q: 'First aid for minor burns:',
        options: ['Apply ice directly', 'Cool with running water for 10-20 minutes', 'Apply butter', 'Pop blisters'],
        answer: 1,
        explanation: 'Cool burns with cool (not cold) running water for 10-20 minutes. Never use ice directly.'
    },
    {
        id: 'general-005',
        pool: 'adult',
        q: 'For severe burns, you should:',
        options: ['Remove stuck clothing', 'Cover with clean cloth, call EMS', 'Apply ice', 'Pop blisters'],
        answer: 1,
        explanation: 'Cover with clean dry cloth, do not remove stuck clothing, and call EMS immediately.'
    },
    {
        id: 'general-006',
        pool: 'adult',
        q: 'Chemical burn first aid:',
        options: ['Apply neutralizer', 'Flush with large amounts of water', 'Cover immediately', 'Apply ointment'],
        answer: 1,
        explanation: 'Flush chemical burns with large amounts of water for at least 20 minutes.'
    },
    {
        id: 'general-007',
        pool: 'adult',
        q: 'For a suspected fracture, you should:',
        options: ['Try to straighten it', 'Immobilize and support the injury', 'Massage the area', 'Apply heat'],
        answer: 1,
        explanation: 'Immobilize the injury in the position found - do not try to straighten or realign.'
    },
    {
        id: 'general-008',
        pool: 'adult',
        q: 'RICE stands for:',
        options: ['Run, Ice, Cool, Elevate', 'Rest, Ice, Compression, Elevation', 'Rub, Inspect, Cool, Exercise', 'Rest, Inspect, Call, Evacuate'],
        answer: 1,
        explanation: 'RICE: Rest, Ice, Compression, Elevation - standard treatment for sprains and strains.'
    },
    {
        id: 'general-009',
        pool: 'adult',
        q: 'If someone has a head injury and vomits:',
        options: ['Give water', 'Monitor closely and call EMS', 'Put on back', 'Give medication'],
        answer: 1,
        explanation: 'Vomiting after head injury is concerning - monitor closely and get emergency help.'
    },
    {
        id: 'general-010',
        pool: 'adult',
        q: 'Signs of serious head injury include:',
        options: ['Minor headache only', 'Confusion, unequal pupils, loss of consciousness', 'Small bump only', 'Mild dizziness only'],
        answer: 1,
        explanation: 'Warning signs include confusion, unequal pupils, repeated vomiting, and loss of consciousness.'
    },
    {
        id: 'general-011',
        pool: 'adult',
        q: 'If you suspect spinal injury:',
        options: ['Move them immediately', 'Keep head and neck still, call EMS', 'Sit them up', 'Turn them over'],
        answer: 1,
        explanation: 'Do not move the person. Stabilize head and neck in position found and call EMS.'
    },
    {
        id: 'general-012',
        pool: 'adult',
        q: 'Signs of possible spinal injury:',
        options: ['Minor back pain', 'Severe neck/back pain, numbness, paralysis', 'Muscle soreness', 'Headache only'],
        answer: 1,
        explanation: 'Signs include severe neck/back pain, tingling, numbness, weakness, or paralysis in limbs.'
    },
    {
        id: 'general-013',
        pool: 'adult',
        q: 'Signs of anaphylaxis:',
        options: ['Minor rash', 'Swelling of throat/tongue, difficulty breathing, hives', 'Slight itch', 'Mild redness'],
        answer: 1,
        explanation: 'Anaphylaxis signs: throat/tongue swelling, difficulty breathing, widespread hives, dizziness.'
    },
    {
        id: 'general-014',
        pool: 'adult',
        q: 'For severe allergic reaction with EpiPen:',
        options: ['Wait 30 minutes', 'Inject immediately into outer thigh, call EMS', 'Inject into arm', 'Give orally'],
        answer: 1,
        explanation: 'Inject epinephrine into outer thigh through clothing if necessary, then call 911.'
    },
    {
        id: 'general-015',
        pool: 'adult',
        q: 'During a seizure, you should:',
        options: ['Restrain the person', 'Protect from injury, cushion head, time seizure', 'Put something in mouth', 'Give water'],
        answer: 1,
        explanation: 'Protect from injury, cushion head, time the seizure, and never put anything in their mouth.'
    },
    {
        id: 'general-016',
        pool: 'adult',
        q: 'After a seizure:',
        options: ['Leave them alone', 'Place in recovery position, stay with them', 'Make them stand', 'Give food'],
        answer: 1,
        explanation: 'Place in recovery position once seizure ends, stay with them, and reassure as they recover.'
    },
    {
        id: 'general-017',
        pool: 'adult',
        q: 'For drowning victim who is breathing:',
        options: ['Leave them alone', 'Place in recovery position, monitor, call EMS', 'Give water', 'Make them walk'],
        answer: 1,
        explanation: 'Place breathing drowning victims in recovery position and monitor closely while waiting for EMS.'
    },
    {
        id: 'general-018',
        pool: 'adult',
        q: 'If drowning victim is not breathing:',
        options: ['Wait for EMS', 'Start CPR immediately', 'Dry them off first', 'Give water'],
        answer: 1,
        explanation: 'Begin CPR immediately for non-breathing drowning victims. Give rescue breaths if trained.'
    },
    {
        id: 'general-019',
        pool: 'adult',
        q: 'Signs of hypothermia:',
        options: ['Sweating', 'Shivering, confusion, slurred speech, drowsiness', 'Warm skin', 'Hyperactivity'],
        answer: 1,
        explanation: 'Hypothermia signs: shivering (may stop in severe cases), confusion, slurred speech, drowsiness.'
    },
    {
        id: 'general-020',
        pool: 'adult',
        q: 'To treat hypothermia:',
        options: ['Give alcohol', 'Move to warm place, remove wet clothes, warm gradually', 'Rub skin vigorously', 'Apply direct heat'],
        answer: 1,
        explanation: 'Move to warmth, remove wet clothing, wrap in blankets, and warm gradually (not rapidly).'
    },
    {
        id: 'general-021',
        pool: 'adult',
        q: 'Signs of heat stroke:',
        options: ['Cold skin', 'Hot dry skin, high temp, confusion, possible unconsciousness', 'Mild sweating', 'Shivering'],
        answer: 1,
        explanation: 'Heat stroke: hot dry skin (or profuse sweating), very high temperature, confusion, may lose consciousness.'
    },
    {
        id: 'general-022',
        pool: 'adult',
        q: 'For heat stroke:',
        options: ['Give hot drinks', 'Cool rapidly, call EMS, apply cool water/ice', 'Continue activity', 'Rest in sun'],
        answer: 1,
        explanation: 'Cool rapidly with cold water, ice packs to neck/armpits/groin. Call 911 immediately.'
    },
    {
        id: 'general-023',
        pool: 'adult',
        q: 'If someone swallows poison:',
        options: ['Induce vomiting', 'Call Poison Control (1-800-222-1222) or EMS', 'Give milk', 'Wait and watch'],
        answer: 1,
        explanation: 'Call Poison Control immediately. Do not induce vomiting unless directed by professionals.'
    },
    {
        id: 'general-024',
        pool: 'adult',
        q: 'For chemical in eye:',
        options: ['Rub eye', 'Flush with water for 15-20 minutes', 'Apply ointment', 'Cover eye'],
        answer: 1,
        explanation: 'Flush the eye with clean water for 15-20 minutes, holding eyelids open.'
    },
    {
        id: 'general-025',
        pool: 'adult',
        q: 'For low blood sugar (conscious diabetic):',
        options: ['Give insulin', 'Give sugar (juice, candy, glucose tablets)', 'Give water only', 'Have them exercise'],
        answer: 1,
        explanation: 'Give fast-acting sugar: juice, regular soda, candy, or glucose tablets.'
    },
    {
        id: 'general-026',
        pool: 'adult',
        q: 'If diabetic is unconscious:',
        options: ['Give sugar by mouth', 'Call EMS, do not give anything by mouth', 'Give insulin shot', 'Pour juice in mouth'],
        answer: 1,
        explanation: 'Never give anything by mouth to unconscious person. Call 911 immediately.'
    },
    {
        id: 'general-027',
        pool: 'adult',
        q: 'To stop a nosebleed:',
        options: ['Tilt head back', 'Lean forward, pinch nostrils for 10 minutes', 'Lie down flat', 'Pack nose with tissue'],
        answer: 1,
        explanation: 'Lean forward slightly, pinch soft part of nose for 10-15 minutes continuously.'
    },
    {
        id: 'general-028',
        pool: 'adult',
        q: 'For object embedded in eye:',
        options: ['Remove it', 'Do not remove, cover both eyes, call EMS', 'Flush with water', 'Apply pressure'],
        answer: 1,
        explanation: 'Never remove embedded objects. Cover both eyes to minimize movement and get medical help.'
    },
    {
        id: 'general-029',
        pool: 'adult',
        q: 'For knocked out tooth:',
        options: ['Throw it away', 'Rinse gently, place in milk or saliva, see dentist immediately', 'Scrub it clean', 'Put in water'],
        answer: 1,
        explanation: 'Handle by crown, rinse gently, keep moist in milk or saliva, see dentist within 30 minutes if possible.'
    }
];

// Build question pools
export const QUESTION_POOLS = {
    adult: [...adultQuestions, ...generalQuestions],
    child: childQuestions,
    infant: infantQuestions,
    mixed: null // Will be computed below
};

// Initialize mixed pool (all categories combined)
QUESTION_POOLS.mixed = [
    ...QUESTION_POOLS.adult,
    ...QUESTION_POOLS.child,
    ...QUESTION_POOLS.infant
];

/**
 * Fisher-Yates shuffle algorithm for unbiased randomization
 * @param {Array} array - Array to shuffle (will be mutated)
 * @returns {Array} - The shuffled array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Get random questions from a specific pool
 * @param {string} type - Pool type: 'adult' | 'child' | 'infant' | 'mixed'
 * @param {number} count - Number of questions to return (default: 5)
 * @returns {Array} - Array of random question objects
 * @throws {Error} - If pool type is invalid or not enough questions
 */
export function getRandomQuestions(type = 'mixed', count = 5) {
    const pool = QUESTION_POOLS[type];

    if (!pool) {
        throw new Error(`Invalid question pool type: ${type}`);
    }

    if (pool.length < count) {
        throw new Error(`Not enough questions in ${type} pool. Need ${count}, have ${pool.length}`);
    }

    // Clone to avoid mutating original pool
    const shuffled = shuffleArray([...pool]);

    return shuffled.slice(0, count);
}

/**
 * Get all available pool types
 * @returns {string[]} - Array of pool type names
 */
export function getPoolTypes() {
    return Object.keys(QUESTION_POOLS);
}

/**
 * Get question count for a specific pool
 * @param {string} type - Pool type
 * @returns {number} - Number of questions in the pool
 */
export function getPoolSize(type) {
    const pool = QUESTION_POOLS[type];
    return pool ? pool.length : 0;
}
