//개발구조에 맞춰 필요하신 부분은 편하신대로 수정하셔도 됩니다. 관리 주체가 변경되었습니다.

////////////////////////////////////////////////////////////////////////////////////////
///////////RIM CLUB validation, written by O.Smith
////////////////////////////////////////////////////////////////////////////////////////
const vldInp = (inp) => {
    const t = inp.dataset.type;
    let v = inp.value.trim();

    if (t === 'rim' || t === 'stamp') {
        v = v.replace(/,/g, '');
        inp.value = v;
    }

    switch (t) {
        case 'rim':
            return /^\d+$/.test(v) && v !== '0' && !/^0+$/.test(v);
        case 'stamp':
            return /^\d+$/.test(v) && v !== '0' && !/^0+$/.test(v);
        case 'phone':
            return /^\d+$/.test(v) && v.length >= 10;
        case 'name':
            return /^[가-힣a-zA-Z]+$/.test(v);
        default:
            return false;
    }
};

const crctRimInp = (inp) => {
    let v = inp.value.trim();
    const max = parseInt(inp.dataset.max, 10); // max 값 가져오기

    if (v.startsWith('0')) {
        inp.value = '0';
    } else if (parseInt(v, 10) > max) { // max 값 초과 시 max 값으로 설정
        inp.value = max;
    } else {
        inp.value = v;
    }
};

const crctStampInp = (inp) => {
    let v = inp.value.trim();
    const max = parseInt(inp.dataset.max, 10); // max 값 가져오기

    if (v.startsWith('0')) {
        inp.value = '0';
    } else if (parseInt(v, 10) > max) { // max 값 초과 시 max 값으로 설정
        inp.value = max;
    } else {
        inp.value = v;
    }
};

const rmvNonNumFrmPh = (inp) => {
    inp.value = inp.value.replace(/[^\d]/g, '');
};

const rstMaxInp = (inp) => {
    inp.addEventListener('input', () => {
        let v = parseInt(inp.value, 10);
        const max = parseInt(inp.dataset.max, 10);

        if (v > max) {
            inp.value = max; // max 값을 초과하면 max 값으로 설정
        }
    });
};

const rstMaxStampInp = (inp) => {
    inp.addEventListener('input', () => {
        let v = parseInt(inp.value, 10);
        const max = parseInt(inp.dataset.max, 10);

        if (v > max) {
            inp.value = max; // max 값을 초과하면 max 값으로 설정
        }
    });
};

const shwErrMsg = (inp) => {
    const errEl = inp.closest('.form').querySelector("p.helper[data-type='error']");
    if (errEl) errEl.style.display = "flex";
};

const hdeErrMsg = (inp) => {
    const errEl = inp.closest('.form').querySelector("p.helper[data-type='error']");
    if (errEl) errEl.style.display = "none";
};

const vldSnglInp = (inp) => {
    if (inp.dataset.type === 'rim') crctRimInp(inp);
    if (inp.dataset.type === 'stamp') crctStampInp(inp);
    if (inp.dataset.type === 'phone') rmvNonNumFrmPh(inp);

    hdeErrMsg(inp);

    if (!vldInp(inp)) {
        shwErrMsg(inp);
        return false;
    }

    return true;
};

const vldAllInpAndExec = (cb) => {
    const inps = document.querySelectorAll('input[data-type]');
    let allVld = true;

    inps.forEach((inp) => {
        if (inp.dataset.type === 'rim') {
            rstMaxInp(inp); // rim에 대해 max 값 제한 적용
        }
        if (inp.dataset.type === 'stamp') {
            rstMaxStampInp(inp); // stamp에 대해 max 값 제한 적용
        }
        if (!vldSnglInp(inp)) {
            allVld = false;
        }
    });

    if (allVld) cb();
    return allVld;
};


document.addEventListener('DOMContentLoaded', () => {
    const modalManager = {
        createModal(event, modalContent, preShowCallback, postShowCallback) {
            // 모달이 생성되기 전에 실행할 함수가 있다면 실행
            if (typeof preShowCallback === 'function') {
                preShowCallback();
            }

            // 이미 있는 모달을 삭제
            this.removeExistingModals();

            const modal = document.createElement('div');
            modal.className = 'windows';
            modal.setAttribute('data-type', 'modal');
            modal.innerHTML = modalContent;

            document.body.appendChild(modal);

            // 모달이 생성된 후에 실행할 함수가 있다면 실행
            if (typeof postShowCallback === 'function') {
                postShowCallback();
            }
        },

        removeExistingModals() {
            const existingModals = document.querySelectorAll('[data-type="modal"]');
            existingModals.forEach(modal => modal.remove());
        },

        giftConfirmSend(preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
            <h2>선물 보내기 확인</h2>
          </div>
          <div class="body">
            <h3>선물을 보내시겠습니까?</h3>
            <p>보낸 선물은 취소할 수 없습니다.</p>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="secondary" data-style="outlined" id="dismiss">취소</button>
            <button class="cta" type="button" data-type="primary" id="confirm">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        giftConfirmAccept(event, preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
            <h2>선물 수락 확인</h2>
          </div>
          <div class="body">
            <h3>선물을 수락하시겠습니까?</h3>
            <p>수락한 선물은 취소할 수 없습니다.</p>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="secondary" data-style="outlined" id="dismiss">취소</button>
            <button class="cta" type="button" data-type="primary" id="confirm">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        giftConfirmReject(preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
            <h2>선물 거절 이미지</h2>
          </div>
          <div class="body">
            <h3>RIM 선물을 거절하시겠습니까?</h3>
            <p>거절한 선물은 되돌릴 수 없습니다.</p>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="secondary" data-style="outlined" id="dismiss">취소</button>
            <button class="cta" type="button" data-type="primary" id="confirm">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        giftMessageSent(preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
            <h2>메시지 발송 완료</h2>
          </div>
          <div class="body">
            <h3>메시지가 성공적으로 발송되었습니다.</h3>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="primary" id="confirm">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        giftMessageCheck(preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
          </div>
          <div class="body">
            <h3>회원권을 선택해 주세요.</h3>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="primary" id="dismiss">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        giftMessageReject(preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
            <h2>메시지 거절</h2>
          </div>
          <div class="body">
            <h3>메시지를 거절하시겠습니까?</h3>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="secondary" data-style="outlined" id="dismiss">취소</button>
            <button class="cta" type="button" data-type="primary" id="confirm">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        giftMessageAccept(preShowCallback, postShowCallback) {
            const content = `
        <div class="contents">
          <div class="head">
            <h2>메시지 수락</h2>
          </div>
          <div class="body">
            <h3>메시지를 수락하시겠습니까?</h3>
          </div>
          <div class="tail">
            <button class="cta" type="button" data-type="secondary" data-style="outlined" id="dismiss">취소</button>
            <button class="cta" type="button" data-type="primary" id="confirm">확인</button>
          </div>
        </div>
      `;
            this.createModal(event, content, preShowCallback, postShowCallback);
        },

        handleModalAction(event) {
            // Dismiss 버튼 클릭 시 모달 제거
            if (event.target.matches('.cta#dismiss')) {
                event.target.closest('.windows').remove();
            }
        },

        handleBackdropClick(event) {
            const target = event.target;
            if (target.classList.contains('windows') &&
                target.getAttribute('data-type') === 'modal' &&
                !target.querySelector('.contents').contains(target)) {
                target.remove();
            }
        }
    };

    const validateMultiID = () => {
        const multiIdElement = document.getElementById('multi-id');

        if (!multiIdElement) {
            return 0;
        }

        const radioButtons = multiIdElement.querySelectorAll('input[type="radio"]');
        const isChecked = Array.from(radioButtons).some(radio => radio.checked);

        return isChecked ? 1 : 0;
    };

    const buttonConfigurations = [
        {
            id: 'gift-confirm-send',
            action: (event) => modalManager.giftConfirmSend(
                () => console.log('Pre-show gift-confirm-send'),
                () => console.log('Post-show gift-confirm-send')
            )
        },
        {
            id: 'gift-confirm-accept',
            action: (event) => {
                const validationResult = validateMultiID();
                if (validationResult === 1) {
                    modalManager.giftConfirmAccept(
                        event,
                        null,
                        () => console.log('Post-show gift-confirm-accept')
                    );
                } else if (validationResult === 0) {
                    modalManager.giftMessageCheck(
                        () => console.log('Pre-show gift-message-check'),
                        () => console.log('Post-show gift-message-check')
                    );
                } else {
                    console.log('Validation failed for gift-confirm-accept');
                }
            }
        },
        {
            id: 'gift-confirm-reject',
            action: (event) => modalManager.giftConfirmReject(
                () => console.log('Pre-show gift-confirm-reject'),
                () => console.log('Post-show gift-confirm-reject')
            )
        },
        {
            id: 'gift-message-sent',
            action: (event) => modalManager.giftMessageSent(
                null,
                () => console.log('Post-show gift-message-sent')
            )
        },
        {
            id: 'gift-message-check',
            action: (event) => modalManager.giftMessageCheck(
                () => console.log('Pre-show gift-message-check'),
                () => console.log('Post-show gift-message-check')
            )
        },
        {
            id: 'gift-message-reject',
            action: (event) => modalManager.giftMessageReject(
                () => console.log('Pre-show gift-message-reject'),
                () => console.log('Post-show gift-message-reject')
            )
        },
        {
            id: 'gift-message-accept',
            action: (event) => modalManager.giftMessageAccept(
                () => console.log('Pre-show gift-message-accept'),
                () => console.log('Post-show gift-message-accept')
            )
        }
    ];

    buttonConfigurations.forEach(config => {
        const button = document.getElementById(config.id);
        if (button) {
            button.addEventListener('click', config.action);
        }
    });

    // 이벤트 위임
    document.body.addEventListener('click', (event) => {
        modalManager.handleModalAction(event);
        modalManager.handleBackdropClick(event);
    });

    // Rim 선물하기 유효성 검사
    const inputs = document.querySelectorAll('input[data-type]');
    if (inputs.length > 0) {
        inputs.forEach((inp) => {
            inp.addEventListener('blur', () => vldSnglInp(inp));
            if (inp.dataset.type === 'rim') rstMaxInp(inp);
        });
    }

    // 선물 보내기 버튼 누를때 유효성 전체 검사 한번 더
    const giftSendButton = document.querySelector('#gift-send');
    if (giftSendButton) {
        giftSendButton.addEventListener('click', () => {
            const isVld = vldAllInpAndExec(() => {
                console.log('pass, callback');
            });

            console.log(isVld ? 'pass' : 'decline');
        });
    }





























});