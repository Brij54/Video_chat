pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')
        GITHUB_CREDENTIALS = credentials('github-credentials-id')
        SSH_CREDENTIALS = credentials('ssh-credentials-id')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials-id', url: 'https://github.com/your-repo/video-chat-app.git'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t your-dockerhub-username/backend:latest .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t your-dockerhub-username/frontend:latest .'
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker run --rm your-dockerhub-username/backend:latest npm test'
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker run --rm your-dockerhub-username/frontend:latest npm test'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push your-dockerhub-username/backend:latest'
                    sh 'docker push your-dockerhub-username/frontend:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    ansiblePlaybook(
                        playbook: 'ansible/deploy.yml',
                        inventory: 'ansible/inventory',
                        credentialsId: 'ssh-credentials-id'
                    )
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
