# Milestones

Ever experienced those moments that leave you pondering, "What have I really accomplished?"

We all have those days. But here's the thing: we need to be kinder to ourselves.  
Self-doubt and imposter syndrome can creep in, but that's where Milestones comes in.

Milestones is a platform where all your victories are captured, celebrated and cherished.  
Archive your achievements, recommendations, awards and even those invaluable kudos.

This app will serve as a reminder that you've achieved a lot and should be proud.  
PS: This is your secret weapon to showcase your value when the next promotion or bi-annual review meetings roll around.

## Getting Started

These instructions will guide you through setting up the project on your local machine for development and testing purposes. For deployment information, refer to the deployment section.

### Pre-requisites

Before you begin, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Prisma CLI
- Your preferred code editor

### Installation

Follow these steps to get the development environment up and running:

1. Clone the repository:

```
$ git clone https://github.com/noh24/milestones.git
```

2. Navigate to the project directory:

```
$ cd milestones
```

3. Install the project dependencies:

```
$ npm install
```

5. Set up a `.env file`:

#### Google Client

- Retreive your Google Client ID & Client Secret at [Google Cloud Platform APIs Dashboard](https://console.cloud.google.com/apis/dashboard)

#### Database Url

- Replace Database Url with your own database URI.

#### Next Auth Url

- Replace with your domain.

#### Secret Tokens

- Replace with a random set of text of your own choice.

```
GOOGLE_CLIENT_ID="12345678910-asmfansodn2nf19cmoqiasjoinij12.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="JS9DJs-asd9NOIHN0-9dAIHOSDHSN"
DATABASE_URL="mysql://username:password@localhost:3306/milestones"

NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_NEXTAUTH_URL="http://localhost:3000"

AUTH_SECRET="thisisjustarandomsecretcodeofyourchoice"
NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN="anotherrandomsecretcodeofyourchoice"
```

6. Set up Prisma:

- Please ensure you have MySql server running.
- At the project root, enter these commands:

```
$ npx prisma generate
$ npx prisma migrate dev
```

7. Start the development server:

```
$ npm run dev
```

8. Open your web browser to access the app at [http://localhost:3000](http://localhost:3000):

### Prisma Database CLI

1. Create New Migrations:

```
$ npx prisma migrate dev --name [name-new-of-migration]
```

## Running Tests

Explain how to run automated tests for the system. Provide information on end-to-end tests and coding style tests if applicable.

## Deployment

Provide additional notes about how to deploy the app on a live system.

## Built With

- Prisma - ORM Database toolkit
- Next.js 13 - React Framework for building full stack applications
- NextAuth - Credentials / OAuth
- Tailwind - Design library
- MySQL - Relational Database

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Authors

- **Brian Noh** - _Initial work_ - [github.com/noh24](https://github.com/noh24)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Be one of the first to make contributions to our open-source project!
