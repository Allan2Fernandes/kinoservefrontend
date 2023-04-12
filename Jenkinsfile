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

        stage('npm Setup'){
            steps{
                sh "echo [Unit]
                     Description=My app

                     [Service]
                     ExecStart=/var/www/myapp/app.js
                     Restart=always
                     User=nobody
                     # Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
                     Group=nogroup
                     Environment=PATH=/usr/bin:/usr/local/bin
                     Environment=NODE_ENV=production
                     WorkingDirectory=/var/www/myapp

                     [Install]
                     WantedBy=multi-user.target"
            }
        }


        stage('Test') {
            steps {

                //Run the project
                sh 'npm run dev'
                //Install testcafe
                sh 'npm install -g testcafe'
                //Run the tests
                sh 'testcafe firefox:headless tests/kinoservetests.js'
            }
        }

        stage('Deploy') {
            steps {
                echo "deploy"
            }
        }
    }
}