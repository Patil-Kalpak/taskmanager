pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t taskmanager .'
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh 'docker stop taskmanager || true'
                    sh 'docker rm taskmanager || true'
                    sh 'docker run -d -p 8081:80 --name taskmanager taskmanager'
                }
            }
        }
    }
}