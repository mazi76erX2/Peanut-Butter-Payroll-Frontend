pipeline {
    agent any

    environment {
        RENDER_APP_ID = 'srv-cv030edumphs73cg7kbg/deploys/dep-cv030edumphs73cg7kh0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Running linter...'
                sh 'npm run lint'
            }
        }
        
        stage('Format Check') {
            steps {
                echo 'Checking code format...'
                sh 'npm run format:check'
            }
        }
        
        stage('Type Check') {
            steps {
                echo 'Running type check...'
                sh 'tsc --noEmit'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Deploy to Render') {
            steps {
                echo "Triggering deployment on Render for app ${env.RENDER_APP_ID}..."
                withCredentials([string(credentialsId: 'render-api-key', variable: 'RENDER_API_KEY')]) {
                    sh """
                        curl -X POST \\
                          -H "Content-Type: application/json" \\
                          -H "Authorization: Bearer ${RENDER_API_KEY}" \\
                          -d '{"clearCache": false}' \\
                          https://api.render.com/v1/deploy/${RENDER_APP_ID}/trigger
                    """
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
