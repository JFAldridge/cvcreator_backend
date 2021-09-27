const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 5;

// Subdocuments
const ContactSchema = new Schema({
    phone: {type: String},
    email: {type: String},
    portfolio: {type: String},
    github: {type: String},
    linkedIn: {type: String},
    instagram: {type: String},
    youtube: {type: String},
    facebook: {type: String}
});

const EducationSchema = new Schema({
    degree: {type: String},
    institution: {type: String},
    timeToDegree: {type: String}
});

const SkillsSchema = new Schema({
    skillType: {type: String},
    skill: []
});

const IntroductionSchema = new Schema({
    givenName: {type: String},
    surname: {type: String},
    title: {type: String},
    about: {type: String}
});

const WorkExperienceSchema = new Schema({
    company: {type: String},
    position: {type: String},
    duration: {type: String},
    summary: {type: String},
    achievement: []
});

const UserSchema = new Schema({
    email: {
        type: String, 
        required: [true, 'An email must be provided'], 
        maxlength: [256, 'Email has too many characters'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
        type: String, 
        required: [true, 'A password must be provided'], 
        maxlength: [128, 'Password must has less than 128 characters'], 
        minLength: [7, 'Password must have at least 7 characters']
    },
    userInfo: {
        contact: ContactSchema,
        education: [EducationSchema],
        skills: [SkillsSchema],
        introduction: IntroductionSchema,
        workExperience: [WorkExperienceSchema]
    }
});

UserSchema.pre('save', function(next) {
    const user = this;

    // Only hash the password if it is new
    if (!user.isModified('password')) return next();

    // Generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // Override the cleartext password with hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);

/*  
{
    email: {type: String, unique: true, required: true, maxlength: 256},
    password: {type: String, required: true, maxlength: 128, minLength: 8},
    contact: {
        phone: '515-515-5151',
        email: 'he-man@ilikefigs.com',
        portfolio: 'he-man.dev',
        linkedIn: 'type: linkedin.com/he-man'
    },
    education: [
        {
        degree: 'Bachlors in Revelry',
        institution: 'U of life',
        timeToDegree: '2010 - 2016'
        }, 
        {
        degree: 'Masters of the University',
        institution: 'Eternia State',
        timeToDegree: '2018 - 2020'
        }
    ],
    skills: [{
        skillType: 'Heroisms',
        skillList: [
            'Kicking skulls',
            'Saving people',
            'Nice abs',
            'Shouting a lot',
            'Team player',
            'Cool sword',
            'Pecs for days'
        ]
    }],
    introduction: {
        givenName: 'He-Man',
        surName: 'Prince Adam',
        title: 'Master of the Universe',
        about: 'He-Man is a superhero and the main character of the sword and sorcery Masters of the Universe franchise, which includes a toy line, several animated television series, comic books and a feature film. He-Man is characterized by his superhuman strength and in most variations, is the alter ego of Prince Adam.'
    },
    workExperience: [
        {
            company: 'The Universe',
            position: 'Master',
            duration: 'Eternity',
            summary: 'Basically god, but only with half a sword instead of an entire one.',
            achievements: [
                'All the things',
                'Found more gold',
                'Made all things happy',
                'Loved cat'
            ]
        },
        {
            company: 'Eternia Royal Family',
            position: 'Prince',
            duration: '1985 - Current',
            summary: 'Ruler of entire planet.  Very cool.',
            achievements: [
                'Dispursed gold',
                'Made subjects happy',
                'Got a cat'
            ]
        }
        
    ]
}
*/