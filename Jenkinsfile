pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t taskmanager:v1 .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop taskmanager || true'
                sh 'docker rm taskmanager || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 80:80 --name taskmanager taskmanager:v1'
            }
        }
    }
}