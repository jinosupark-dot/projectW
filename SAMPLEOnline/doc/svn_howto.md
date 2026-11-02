## Repository 구성 작업순서
1. 로컬 폴더를 백업한다.
1. 최초 import는 svn:ignore가 적용되지 않기에, 관리 안 할 폴더 및 파일은 모두 삭제한다.
1. `svn import` 로 import 한다.
    ```bash
    svn import "C:/dev/SAMPLEOnline" "https://legion5-jinosu:8443/svn/projectTest/trunk/SAMPLEOnline" -m "최초 소스 등록"
    ```
1. `svn checkout`으로 로컬 svn 폴더를 만든다. 
    ```bash
    svn checkout "https://legion5-jinosu:8443/svn/projectTest/trunk/SAMPLEOnline" "C:/dev/projectTest/SAMPLEOnline"
    ```
1. 그러면 C:/dev/projectTest/SAMPLEOnline/.svn 이 있는 폴더가 만들어진다.
1. _target_ 폴더를 제외하려면 아래와 같이 써주고 뒤에 "." 이 있어야 한다.
    ```bash
    svn propset svn:ignore "target" .
    ```
1. `svn status` 로 현재 작업 영역 변경 사항을 검색한다.
1. 기호의 의미는 다음과 같다.
    | 기호 | 의미 |
    |---|---|
    | `?` | 버전 관리 대상이 아닌 파일 |
    | `A` | 추가 예약 |
    | `M` | 수정됨 |
    | `D` | 삭제 예약 |
    | `!` | 작업 사본에서 파일이 없어짐 |
    | `C` | 충돌 발생 |
    | `R` | 교체 예약 |
    | `~` | 파일/디렉터리 종류가 변경됨 |
1. `svn status -u` 는 원격저장소에 로컬에서 아직 반영하지 않은 변경사항이 있는지 확인할 때 사용합니다.
1. 저장소 정보 확인
    ```bash
    svn info
    ```
1. 로그 확인:
    ```bash
    svn log -l 10
    ```
1. 현재 디렉터리의 새 파일 일괄 추가 : 하위디렉토리까지 추가되는지 확인 필요.
    ```bash
    svn add --force .
    ```
1. 변경사항 저장소에 반영
    ```bash
    svn commit -m "서비스 기능 수정"
    ```
1. 커밋 전 확인 순서 : svn diff 한글이 깨져. ~/.bashrc 에 svndiff 를 정의함.
    ```bash
    svn status
    svn diff
    svn commit -m "변경사항 설명"
    ```
1. 최신 변경사항 받기
    ```bash
    svn update
    ```
1. 특정 디렉터리만 업데이트:
    ```bash
    svn update "src"
    ```
1. 파일 삭제
    ```bash
    svn delete "src/OldService.java"
    svn commit -m "사용하지 않는 서비스 삭제"
    ```

1. 파일 이름 변경
    ```bash
    svn move "OldService.java" "NewService.java"
    svn commit -m "서비스 파일명 변경"
    ```

1. 작업 사본에서 수정 취소
    ```bash
    svn revert "src/main/java/com/example/Service.java"
    ```

1. 현재 디렉터리와 하위 파일의 수정 취소:
    ```bash
    svn revert -R .
    ```
    **주의:** Revert는 로컬의 미커밋 변경사항을 취소합니다. 필요한 수정사항은 먼저 백업하세요.



## svn import 하기 전에 svn:ignore 를 해야 한다.
### 추천 방법: Import 전에 제외 파일 정리
* Spring Boot + Maven 프로젝트라면 다음 순서가 안전합니다.
1. 로컬 프로젝트에서 target/, 로그 파일 등 불필요한 파일을 임시로 이동하거나 제거합니다.
2. svn import로 소스를 등록합니다.
3. 별도 디렉터리에 svn checkout을 실행합니다.
4. 체크아웃한 작업 사본에 svn:ignore를 설정합니다.
5. 이후 개발은 체크아웃한 작업 사본에서 진행합니다.


## Repositoy 관리 전략.
```
SampleOnline/
├── trunk/                  # 기본 개발 소스
├── branches/               # 
└── tags/                   # 특정 시점의 고정 버전
    ├── 1.0.0/              # 통합 1차 테스트 1.0.0 고정 버전
    ├── 2.0.0/              # 통합 2차 테스트 2.0.0 고정 버전
    └── 3.0.0/              # 통합 3차 테스트 3.0.0 고정 버전
```
3. 버전별 관리 흐름
    |시점|작업|
    |---|---|
    |개발 진행|	trunk에서 기능 개발|
    |테스트 및 오류 수정|trunk에서 수정|
    |1.0.0 배포 준비|	tags/1.0.0 생성, Local 기능 테스트 완료|
    |1.0.0 배포 완료|	tags/1.0.0으로 복사하여 배포 버전 고정|
    |...|	...|
    |1.0.x 배포 준비|	tags/1.0.x 생성, Local 기능 테스트 완료|
    |1.0.x 배포 완료|	tags/1.0.x 으로 복사하여 배포 버전 고정|
    |...|	...|
    |다음 버전 개발|	trunk에서 2.0 기능 개발 계속|
    |2.0.0 배포 준비|	tags/2.0.0 생성, Local 기능 테스트 완료|
    |2.0.0 배포 완료|	tags/2.0.0으로 복사하여 배포 버전 고정|
    |...|	...|
    |3.0.0 배포 준비|	tags/3.0.0 생성, Local 기능 테스트 완료|
    |3.0.0 배포 완료|	tags/3.0.0으로 복사하여 배포 버전 고정|



* release 브랜치 생성
```
svn copy https://legion5-jinosu:8443/svn/projectTest/trunk/SAMPLEOnline https://legion5-jinosu:8443/svn/projectTest/branches/release/1.0/ -m "통합 테스트 1.0 브랜치 생성"
```
* tags 브랜치 생성
```
svn copy https://legion5-jinosu:8443/svn/projectTest/trunk/SAMPLEOnline https://legion5-jinosu:8443/svn/projectTest/tags/1.0.0/ -m "통합 테스트 1.0 Tags 생성"
```
