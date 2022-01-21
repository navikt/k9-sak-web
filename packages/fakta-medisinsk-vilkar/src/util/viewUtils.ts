const scrollUp = (): void => {
    const element = document.getElementById('medisinskVilkår');
    const elementOffset = element?.offsetTop || 0;

    window.scroll(0, elementOffset - 50);
};

export default scrollUp;
