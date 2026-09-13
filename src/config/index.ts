import "dotenv/config";


export const config = {

    port: process.env.PORT || 5000,

    database_url: process.env.DATABASE_URL,


    jwt: {

        accessSecret:
            process.env.JWT_ACCESS_SECRET as string,

        refreshSecret:
            process.env.JWT_REFRESH_SECRET as string,


        accessExpiresIn:
            process.env.JWT_ACCESS_EXPIRES_IN,


        refreshExpiresIn:
            process.env.JWT_REFRESH_EXPIRES_IN

    },


    bcryptSaltRounds:
        Number(process.env.BCRYPT_SALT_ROUNDS)

};