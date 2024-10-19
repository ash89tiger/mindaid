import React from "react";
import styled from "styled-components";

//component

//images
import signal from "../images/signal.png"
import wifi from "../images/wifi.png"
import battery from "../images/battery.png"

//style
const Wrapper = styled.div`
    width: calc(100% - 40px);
    height: 48px;
    padding: 0px 20px;
    background:white;

    display:flex;
    align-items:center;
    justify-content: space-between;

    position:fixed;
    top:0;
    left:auto;
    z-index:10;
`

const PhoneTime = styled.p`
    font-size:16px;
    font-weight:600;
    color:var(--main-textColor);
`

const PhoneUtilConatiner = styled.div`
    display:flex;
    align-items:center;
`

const PhoneUtil = styled.img`
    width:16px;
    height:auto;
    margin-right:8px;

    &:last-child {
        margin-right:0;
        width: 24px;
    }
`

function FixedTop(props) {

    return (

        <Wrapper>
            <PhoneTime>08:58</PhoneTime>
            <PhoneUtilConatiner>
                <PhoneUtil src={signal}></PhoneUtil>
                <PhoneUtil src={wifi}></PhoneUtil>
                <PhoneUtil src={battery}></PhoneUtil>
            </PhoneUtilConatiner>
        </Wrapper>

    )

}

export default FixedTop;