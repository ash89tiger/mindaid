import React from "react";
import styled from "styled-components";

// styled components
const NavItemFrame = styled.div`
    width: 64px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NavIcon = styled.img`
    width: 36px;
    height: 36px;
`;

function NavigationItem(props) {
    const { onClick, imageUrl } = props;

    return (
        <NavItemFrame onClick={onClick}>
            <NavIcon src={imageUrl} />
        </NavItemFrame>
    );
}

export default NavigationItem;
