export interface Exercise {
    id: string;
    name: string;
    targetArea: string;
    mode: 'Strength' | 'Burn';
    description: string;
    category: 'lower' | 'upper' | 'core' | 'cardio';
}

export const exercises: Exercise[] = [
    {
        id: '1',
        name: 'Air Squat',
        targetArea: 'Thighs',
        mode: 'Strength',
        description: 'Keep your chest up, push your knees out, and sit back into your heels.',
        category: 'lower',
    },
    {
        id: '2',
        name: 'Bicycle Crunch',
        targetArea: 'Waist/Core',
        mode: 'Strength',
        description: 'Touch elbow to opposite knee while extending the other leg. Keep your lower back pressed to the floor.',
        category: 'core',
    },
    {
        id: '3',
        name: 'Lateral Lunge',
        targetArea: 'Thighs',
        mode: 'Strength',
        description: 'Step wide to the side, sit back into one hip while keeping the other leg straight.',
        category: 'lower',
    },
    {
        id: '4',
        name: 'Plank',
        targetArea: 'Core',
        mode: 'Strength',
        description: 'Keep your body in a straight line from head to heels. Engage your core and don\'t let your hips sag.',
        category: 'core',
    },
    {
        id: '5',
        name: 'Mountain Climbers',
        targetArea: 'Cardio/Core',
        mode: 'Burn',
        description: 'Drive your knees toward your chest in a running motion while maintaining a plank position.',
        category: 'cardio',
    },
    {
        id: '6',
        name: 'Incline Push-ups',
        targetArea: 'Upper Body',
        mode: 'Burn',
        description: 'Place hands on an elevated surface. Lower your chest toward it, then push back up.',
        category: 'upper',
    },
    {
        id: '7',
        name: 'Glute Bridge',
        targetArea: 'Glutes/Thighs',
        mode: 'Strength',
        description: 'Lie on your back, push through your heels to lift your hips. Squeeze at the top.',
        category: 'lower',
    },
    {
        id: '8',
        name: 'Dead Bug',
        targetArea: 'Core',
        mode: 'Strength',
        description: 'Lie on your back, extend opposite arm and leg while keeping your lower back flat.',
        category: 'core',
    },
    {
        id: '9',
        name: 'Jumping Jacks',
        targetArea: 'Full Body',
        mode: 'Burn',
        description: 'Jump feet out while raising arms overhead, then return to starting position.',
        category: 'cardio',
    },
    {
        id: '10',
        name: 'Wall Sit',
        targetArea: 'Thighs',
        mode: 'Strength',
        description: 'Slide down a wall until your thighs are parallel to the floor. Hold the position.',
        category: 'lower',
    },
];

export const getWorkoutForDay = (dayOfWeek: number): { type: string; exercises: Exercise[] } => {
    // Sunday = 0, Monday = 1, etc.
    if (dayOfWeek === 0) {
        return {
            type: 'Active Recovery',
            exercises: [], // Rest day - walking
        };
    }

    if ([1, 3, 5].includes(dayOfWeek)) {
        // Mon, Wed, Fri - Lower Body & Waist Focus
        return {
            type: 'Lower Body & Waist Focus',
            exercises: exercises.filter(e => e.category === 'lower' || e.category === 'core'),
        };
    }

    // Tue, Thu, Sat - Full Body Burn
    return {
        type: 'Full Body Burn',
        exercises: exercises,
    };
};

export const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
};
