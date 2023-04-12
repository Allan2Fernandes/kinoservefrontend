pipeline {
    agent any
    triggers { pollSCM 'H/5 * * * *' }
    stages {
        stage('Checkout') {
            steps {
                echo "checkout"
            }
        }

        stage('Build') {
            steps {
                 nodejs(nodeJSInstallationName: 'Node 19.7.0', configId: 'ccc49d82-669c-4f7a-b97e-6687f63bb9f6') {

                    // Install project dependencies
                    sh 'npm install'

                    // Build the project
                    sh 'npm run build'
                 }
            }
        }


        stage('Test') {
            steps {

                //Run the project
                sh 'npm run dev'
                //Install testcafe
                sh 'npm install -g testcafe'
                //Run the end to end tests
                sh 'testcafe firefox:headless tests/kinoservetests.js'

                //Performance tests
                sh 'sudo apt-get install k6'
                sh 'k6 run tests/k6tests.js'
            }
        }

        stage('Deploy') {
            steps {
                echo "deploy"
            }
        }
    }
}