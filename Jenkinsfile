pipeline {
    agent any

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
                echo "tEST6"
            }
        }

        stage('Deploy') {
            steps {
                echo "deploy"
            }
        }
    }
}