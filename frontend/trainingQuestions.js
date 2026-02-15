// Comprehensive Training Question Bank - Mixed Pool (60+ questions)
export const TRAINING_POOLS = {
    mixed: [
        // CPR - Adult
        { q: 'What is the recommended compression rate for adult CPR?', options: ['60-80/min', '100-120/min', '140-160/min', '80-90/min'], answer: 1 },
        { q: 'Compression depth for an adult should be:', options: ['About 1 inch', 'At least 2 inches (5 cm)', 'Over 3 inches', 'Barely press'], answer: 1 },
        { q: 'Where do you place your hands for adult compressions?', options: ['Lower abdomen', 'Center of the chest on the sternum', 'Left side of chest', 'Over the stomach'], answer: 1 },
        { q: 'Ratio for single rescuer adult CPR with breaths is:', options: ['15:2', '5:1', '30:2', '20:2'], answer: 2 },
        { q: 'If unwilling/unable to give breaths, you should:', options: ['Stop CPR', 'Do compressions only', 'Wait for EMS', 'Give 1 breath per 5 compressions'], answer: 1 },

        // CPR - Child
        { q: 'Compression depth for a child:', options: ['About 1/3 chest depth (~2 inches)', '1 inch', '3 inches', 'Barely press'], answer: 0 },
        { q: 'Single rescuer ratio for child CPR:', options: ['15:2', '30:2', '20:2', '5:1'], answer: 1 },

        // CPR - Infant
        { q: 'Compression depth for infant:', options: ['1 inch', 'About 1/3 chest depth (~1.5 inches)', '3 inches', 'Light touch'], answer: 1 },
        { q: 'Infant compression technique:', options: ['Two fingers just below nipple line', 'Two thumbs encircling hands', 'Heel of hand', 'On abdomen'], answer: 0 },
        { q: 'Rescue breaths for infant:', options: ['Seal mouth and nose, gentle puffs ~1 second', 'Hard breaths 3 seconds', 'No breaths', 'Breath only through mouth'], answer: 0 },

        // Choking - Adult
        { q: 'For a conscious choking adult, you should:', options: ['Slap their back lightly', 'Perform abdominal thrusts (Heimlich)', 'Give water', 'Lay them down'], answer: 1 },
        { q: 'Where do you place your fist for abdominal thrusts?', options: ['On the chest', 'Just above the navel', 'On the throat', 'On the back'], answer: 1 },
        { q: 'If a choking person becomes unconscious:', options: ['Continue thrusts', 'Start CPR', 'Give water', 'Wait for EMS'], answer: 1 },

        // Choking - Infant
        { q: 'For a choking infant, you should give:', options: ['Abdominal thrusts', '5 back blows and 5 chest thrusts', 'Water', 'Finger sweep'], answer: 1 },
        { q: 'Position for infant back blows:', options: ['Face up on lap', 'Face down on forearm, head lower than chest', 'Standing upright', 'Lying flat'], answer: 1 },

        // Bleeding Control
        { q: 'First step for severe bleeding:', options: ['Apply tourniquet', 'Direct pressure on wound', 'Elevate only', 'Pour water'], answer: 1 },
        { q: 'If bleeding soaks through bandage:', options: ['Remove and replace', 'Add more bandages on top', 'Stop applying pressure', 'Pour alcohol'], answer: 1 },
        { q: 'Use a tourniquet when:', options: ['For any cut', 'Severe limb bleeding not controlled by pressure', 'Minor scrapes', 'Head wounds'], answer: 1 },

        // Burns
        { q: 'First aid for minor burns:', options: ['Apply ice directly', 'Cool with running water for 10-20 minutes', 'Apply butter', 'Pop blisters'], answer: 1 },
        { q: 'For severe burns, you should:', options: ['Remove stuck clothing', 'Cover with clean cloth, call EMS', 'Apply ice', 'Pop blisters'], answer: 1 },
        { q: 'Chemical burn first aid:', options: ['Apply neutralizer', 'Flush with large amounts of water', 'Cover immediately', 'Apply ointment'], answer: 1 },

        // Fractures & Sprains
        { q: 'For a suspected fracture, you should:', options: ['Try to straighten it', 'Immobilize and support the injury', 'Massage the area', 'Apply heat'], answer: 1 },
        { q: 'RICE stands for:', options: ['Run, Ice, Cool, Elevate', 'Rest, Ice, Compression, Elevation', 'Rub, Inspect, Cool, Exercise', 'Rest, Inspect, Call, Evacuate'], answer: 1 },

        // Head Injury
        { q: 'If someone has a head injury and vomits:', options: ['Give water', 'Monitor closely and call EMS', 'Put on back', 'Give medication'], answer: 1 },
        { q: 'Signs of serious head injury include:', options: ['Minor headache', 'Confusion, unequal pupils, loss of consciousness', 'Small bump', 'Mild dizziness'], answer: 1 },

        // Spinal Injury
        { q: 'If you suspect spinal injury:', options: ['Move them immediately', 'Keep head and neck still, call EMS', 'Sit them up', 'Turn them over'], answer: 1 },
        { q: 'Signs of possible spinal injury:', options: ['Minor back pain', 'Severe neck/back pain, numbness, paralysis', 'Muscle soreness', 'Headache only'], answer: 1 },

        // Shock
        { q: 'Signs of shock include:', options: ['Warm dry skin', 'Pale/cool/clammy skin, rapid pulse, confusion', 'High energy', 'Hunger'], answer: 1 },
        { q: 'To treat shock:', options: ['Give water', 'Lay person down, elevate legs, keep warm', 'Have them stand', 'Give food'], answer: 1 },

        // Allergic Reaction / Anaphylaxis
        { q: 'Signs of anaphylaxis:', options: ['Minor rash', 'Swelling of throat/tongue, difficulty breathing, hives', 'Slight itch', 'Mild redness'], answer: 1 },
        { q: 'For severe allergic reaction with EpiPen:', options: ['Wait 30 minutes', 'Inject immediately into outer thigh, call EMS', 'Inject into arm', 'Give orally'], answer: 1 },

        // Seizures
        { q: 'During a seizure, you should:', options: ['Restrain the person', 'Protect from injury, cushion head, time seizure', 'Put something in mouth', 'Give water'], answer: 1 },
        { q: 'After a seizure:', options: ['Leave them alone', 'Place in recovery position, stay with them', 'Make them stand', 'Give food'], answer: 1 },

        // Stroke
        { q: 'FAST for stroke stands for:', options: ['Feel, Ask, Stop, Time', 'Face drooping, Arm weakness, Speech difficulty, Time to call', 'First, Assess, Stabilize, Transport', 'Fast Action Saves Time'], answer: 1 },
        { q: 'If you suspect stroke:', options: ['Wait to see if it improves', 'Call EMS immediately, note time symptoms started', 'Give aspirin first', 'Lay them down'], answer: 1 },

        // Heart Attack
        { q: 'Signs of heart attack:', options: ['Stomach ache', 'Chest pain/pressure, shortness of breath, arm/jaw pain', 'Headache', 'Leg pain'], answer: 1 },
        { q: 'For suspected heart attack:', options: ['Wait it out', 'Call EMS, have person rest, chew aspirin if not allergic', 'Exercise', 'Take a nap'], answer: 1 },

        // Drowning
        { q: 'For drowning victim who is breathing:', options: ['Leave them alone', 'Place in recovery position, monitor, call EMS', 'Give water', 'Make them walk'], answer: 1 },
        { q: 'If drowning victim is not breathing:', options: ['Wait for EMS', 'Start CPR immediately', 'Dry them off first', 'Give water'], answer: 1 },

        // Hypothermia
        { q: 'Signs of hypothermia:', options: ['Sweating', 'Shivering, confusion, slurred speech, drowsiness', 'Warm skin', 'Hyperactivity'], answer: 1 },
        { q: 'To treat hypothermia:', options: ['Give alcohol', 'Move to warm place, remove wet clothes, warm gradually', 'Rub skin vigorously', 'Apply direct heat'], answer: 1 },

        // Heat Stroke
        { q: 'Signs of heat stroke:', options: ['Cold skin', 'Hot dry skin, high temp, confusion, possible unconsciousness', 'Mild sweating', 'Shivering'], answer: 1 },
        { q: 'For heat stroke:', options: ['Give hot drinks', 'Cool rapidly, call EMS, apply cool water/ice', 'Continue activity', 'Rest in sun'], answer: 1 },

        // Poisoning
        { q: 'If someone swallows poison:', options: ['Induce vomiting', 'Call Poison Control (1-800-222-1222) or EMS', 'Give milk', 'Wait and watch'], answer: 1 },
        { q: 'For chemical in eye:', options: ['Rub eye', 'Flush with water for 15-20 minutes', 'Apply ointment', 'Cover eye'], answer: 1 },

        // Diabetes Emergency
        { q: 'For low blood sugar (conscious diabetic):', options: ['Give insulin', 'Give sugar (juice, candy, glucose tablets)', 'Give water only', 'Have them exercise'], answer: 1 },
        { q: 'If diabetic is unconscious:', options: ['Give sugar by mouth', 'Call EMS, do not give anything by mouth', 'Give insulin shot', 'Pour juice in mouth'], answer: 1 },

        // Nosebleed
        { q: 'To stop a nosebleed:', options: ['Tilt head back', 'Lean forward, pinch nostrils for 10 minutes', 'Lie down flat', 'Pack nose with tissue'], answer: 1 },

        // Eye Injury
        { q: 'For object embedded in eye:', options: ['Remove it', 'Do not remove, cover both eyes, call EMS', 'Flush with water', 'Apply pressure'], answer: 1 },

        // Tooth Knocked Out
        { q: 'For knocked out tooth:', options: ['Throw it away', 'Rinse gently, place in milk or saliva, see dentist immediately', 'Scrub it clean', 'Put in water'], answer: 1 },

        // AED Use
        { q: 'When should you use an AED?', options: ['For conscious person', 'For unresponsive person not breathing normally', 'For broken bones', 'For choking'], answer: 1 },
        { q: 'Before AED shock:', options: ['Continue compressions', 'Make sure no one is touching victim', 'Give rescue breaths', 'Check pulse'], answer: 1 },
        { q: 'After AED delivers shock:', options: ['Wait 5 minutes', 'Immediately resume CPR starting with compressions', 'Check pulse for 1 minute', 'Give 10 breaths'], answer: 1 },

        // General Emergency Response
        { q: 'First step in any emergency:', options: ['Move the victim', 'Ensure scene safety', 'Give CPR', 'Call family'], answer: 1 },
        { q: 'When calling EMS, provide:', options: ['Just your name', 'Location, what happened, number of victims, condition', 'Only location', 'Nothing, just hang up'], answer: 1 },
        { q: 'Recovery position is used for:', options: ['Broken leg', 'Unconscious but breathing person', 'Choking victim', 'CPR'], answer: 1 }
    ]
};
