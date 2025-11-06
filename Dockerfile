# 1. 기본 Python 이미지
FROM python:3.12-slim

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 앱 파일 복사
COPY app.py /app/
COPY templates /app/templates
COPY static /app/static

# 4. 필요한 패키지 설치
RUN pip install --no-cache-dir flask psutil

# 5. 포트 열기
EXPOSE 8080

# 6. 앱 실행
CMD ["python", "app.py"]
