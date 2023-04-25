import { MoreFunProduct, MoreFunProductRequest, Product } from "@models"
import { Grid, stepperClasses, Box, Button, Typography, Stack, TextField, InputAdornment } from "@mui/material"
import { PlusMinusCard } from "@sharedComponents"
import { useContext, useEffect, useState } from "react"

import style from "@styles/MoreFun.module.scss"
import ContinueWithPrice from "src/shared/components/ContinueWithPriceFooter"
import { ProductsContext } from "context/productsContext"
import { addToCartEvent, EcommerceItem, removeFromCartEvent, viewItemEvent, viewItemListEvent } from "src/shared/utils/googleAnalytics"
// import { margin } from "@mui/system"
import { AddonToLineItem, LineItemDto } from "services/cartService"
import { StepperContext } from "context/stepperContext"
import cardStyle from "@styles/SharedComponents.module.scss"

import BeforeYouGoComponent from "../BeforeYouGo/BeforeYouGoComponent";
// import { SettingsEthernetSharp } from "@mui/icons-material"
import { CUSTOM_DONATION_GID } from "constants/global"
// import CurrencyInput from "react-currency-input-field"

export const MoreFun = (props: any) => {
    const prodContext = useContext(ProductsContext);
    const { moreFunProducts, addedMoreFunProducts, tickets, update, selectedProduct, addToCart, removeCartItem, cart } = prodContext;
    const { stepper, stepForward, stepBackward, stepChanged } = useContext(StepperContext);
    const [adding, setAdding] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(addedMoreFunProducts.find(x => x.addon.isDonation && x.quantity > 0)?.addon.variantId ?? "");
    const [isCustomDonation, setIsCustomDonation] = useState((addedMoreFunProducts.find(x => x.addon.isDonation && x.quantity > 0)?.addon.variantId ?? "") === CUSTOM_DONATION_GID);
    const [customDonationAmount, setCustomDonationAmount] = useState(
        (addedMoreFunProducts.find(x => x.addon.variantId === CUSTOM_DONATION_GID && x.quantity > 0)?.quantity ?? 1).toFixed(2)
    );

    useEffect(() => {
        /*  let tempArr = []
          for (let i = 0; i < incomingProducts.length; i++) {
              if (moreFunProducts == undefined) return
              tempArr.push(addedMoreFunProducts.filter((element) => element.addon.title = moreFunProducts[i].title).length)
          }
          setAmounts(tempArr);*/

        if (moreFunProducts && moreFunProducts.length > 0 && stepper.step === 5) {
            const gaItems: EcommerceItem[] = moreFunProducts.map<EcommerceItem>((v, i) => {
                let ga = v.gaItem;
                ga.item_list_id = "add_more_fun";
                ga.item_list_name = "add_more_fun";
                ga.index = i;
                return ga;
            });

            viewItemListEvent(window, document, gaItems);
            viewItemEvent(window, document, gaItems[0]);
        }
    }, [stepChanged]);

    const updateCart = () => {
        setAdding(true);
        let lis: LineItemDto[] = [];
        addedMoreFunProducts.map(a => AddonToLineItem([a])).forEach(a => lis.push(...a));
        if (lis.length > 0) {
            addToCart(cart || {}, lis, prodContext, update).then((r) => {
                setAdding(false);
                stepForward();
            })
        } else {
            setAdding(false);
            stepForward();
        }
    }

    const HandleDonationSelect = (variantId: string) => {
        let d = moreFunProducts?.find(x => x.variantId === variantId);

        if (variantId === selectedDonation) {
            setIsCustomDonation(false);
            setSelectedDonation("");
            updateDonationReservation(variantId, 0);

        } else {
            setIsCustomDonation(variantId === CUSTOM_DONATION_GID);
            setSelectedDonation(variantId);
            if (d) {
                viewItemEvent(window, document, d.gaItem);
            }
            if (variantId !== CUSTOM_DONATION_GID) {
                updateDonationReservation(variantId, 1);
            }

        }
    }

// @james
    // let [count, setCount] = useState(1.00);

    function incrementDonation() {
        // count = count + 1.00;
        // setCount(count);
        // console.log("incrementDonation");
        // HandleDonationSet(count);
    }
    function decrementDonation() {
        // count = count - 1.00;
        // setCount(count);
        // console.log("decrementDonation");
        // HandleDonationSet(count);
    }




    // const HandleDonationSet = (e: any) => {
    //     if (e?.target?.value) {
    //         let val = Number.parseFloat(e.target.value);
    //         setCustomDonationAmount((val < 1 ? 1 : val).toFixed(2));
    //         updateDonationReservation(CUSTOM_DONATION_GID ?? "", val < 1 ? 1 : val);
    //     } else {
    //         setCustomDonationAmount("1.00");
    //     }
    // }


    // daniel's new code
    const HandleDonationSet = (e: any, increment: boolean) => {
  if (e?.target?.value) {
    let val = Number.parseFloat(e.target.value);
    val = increment ? val + 1 : val - 1;
    val = val < 1 ? 1 : val;
    setCustomDonationAmount(val.toFixed(2));
    updateDonationReservation(CUSTOM_DONATION_GID ?? "", val);
  } else {
    setCustomDonationAmount("1.00");
  }
}

<button onClick={(e) => HandleDonationSet(e, true)}>Increment</button>
<button onClick={(e) => HandleDonationSet(e, false)}>Decrement</button>










    function updateDonationReservation(variantId: string, quantity: number) {
        if (moreFunProducts == undefined) return
        let addon = moreFunProducts.find(x => x.variantId === variantId);
        if (!addon) return;

        let donationVariantIds = moreFunProducts?.filter(x => x.isDonation)?.map(x => x.variantId);
        let existingReservation = addedMoreFunProducts.find(x => donationVariantIds.indexOf(x.addon.variantId) >= 0);
        let nextId = Math.max(...((addedMoreFunProducts || []).map(x => x.localId)).concat([0]));
        let tempArr = addedMoreFunProducts;
        let ga = addon.gaItem;
        ga.quantity = quantity;
        ga.item_list_id = "add_more_fun";
        ga.item_list_name = "add_more_fun";

        if (!existingReservation) {
            //create & add new reservation
            let addonRequest = {
                addon: addon,
                quantity: quantity,
                totalCost: quantity * addon.price,
                localId: nextId + 1, //todo do math
                shopifyId: ""
            };
            addedMoreFunProducts.push(addonRequest);
            update({ addedMoreFunProducts: addedMoreFunProducts });
            addToCartEvent(window, document, [ga]);

        } else if (existingReservation?.addon?.variantId !== variantId) {
            let copyOfReservations = addedMoreFunProducts.filter(x => x.localId !== existingReservation?.localId);
            existingReservation.addon.gaItem.quantity = existingReservation.quantity;
            removeFromCartEvent(window, document, [existingReservation.addon.gaItem]);
            //remove old reservation
            //add new reservation
            let addonRequest = {
                addon: addon,
                quantity: quantity,
                totalCost: quantity * addon.price,
                localId: nextId + 1, //todo do math
                shopifyId: ""
            };
            copyOfReservations.push(addonRequest);
            update({ addedMoreFunProducts: copyOfReservations });
            addToCartEvent(window, document, [ga]);
        } else {
            //update the existing reservation
            existingReservation.addon.gaItem.quantity = existingReservation.quantity;
            existingReservation.quantity = quantity;
            existingReservation.totalCost = quantity * addon.price;
            removeFromCartEvent(window, document, [existingReservation.addon.gaItem]);
            existingReservation.addon.gaItem.quantity = quantity;
            addToCartEvent(window, document, [existingReservation.addon.gaItem]);
            update({ addedMoreFunProducts: addedMoreFunProducts });
            return
        }
    }

    const HandleCard = (title: string, change: number, index: number) => {
        if (moreFunProducts == undefined) return
        let addon = moreFunProducts[index];
        let tempArr = addedMoreFunProducts;
        let ga = addon.gaItem;
        ga.quantity = 1;
        ga.item_list_id = "add_more_fun";
        ga.item_list_name = "add_more_fun";

        let nextId = Math.max(...((addedMoreFunProducts || []).map(x => x.localId)).concat([0]));

        if (change == 1) {
            let addonRequest = addedMoreFunProducts.find(x => x.addon.variantId === addon.variantId);
            if (!addonRequest) {
                addonRequest = {
                    addon: addon,
                    quantity: 0,
                    totalCost: 0.0,
                    localId: nextId + 1, //todo do math
                    shopifyId: ""
                };
                addedMoreFunProducts.push(addonRequest);
            }

            addonRequest.quantity = addonRequest.quantity + 1;
            addonRequest.totalCost = addonRequest.quantity * addon.price;
            update({ addedMoreFunProducts: addedMoreFunProducts });
            addToCartEvent(window, document, [ga]);

        } else {
            let addonRequest = addedMoreFunProducts.find(x => x.addon.variantId === addon.variantId);
            if (addonRequest && (addonRequest?.quantity || 0) > 0) {
                addonRequest.quantity = addonRequest.quantity - 1;
                addonRequest.totalCost = addonRequest.quantity * addon.price;
                update({ addedMoreFunProducts: addedMoreFunProducts });
                removeFromCartEvent(window, document, [ga]);
            }
        }
        return
    }


    return (
        <>
            <Grid container maxWidth="lg" spacing={0} className={`${style.ticketsTwoCol}  ${style.ticketsTwoColFlat}  flowBox`}>
                <Grid item xs={12} md={6} className={`${style.ticketsTwoColItem} flowBoxItem`}>
                    <Box sx={{ marginBottom: '2rem' }}>
                        <Typography variant="h4" component="h2" className={`${style.sectionHeader} ${style.sectionHeaderTickets} largeHeading`}>
                            {/* {(selectedProduct?.includedExperiences || 0) === 0 ? "4" : "5"}.  */} Add an Audio Tour
                        </Typography>
                        <Typography variant="h6" component="h6" className={`${style.sectionHeader} ${style.sectionHeaderTickets} subHeadingMD`}>
                            Prefer a listening experience? Enjoy a self-guided tour with the Museum&apos;s audio devices.
                        </Typography>
                    </Box>

                    {moreFunProducts?.filter(x => x.isDonation === false).map((element, index) => {
                        return (
                            <Grid className={style.card} item xs={12} md={12} key={index} >
                                <PlusMinusCard
                                    onClick={HandleCard}
                                    amount={[0].concat(addedMoreFunProducts.filter(x => x.addon.variantId === element.variantId).map(x => x.quantity)).reduce((p, c) => p + c)}
                                    title={element.title}
                                    subText={element.subtitle}
                                    price={element.price}
                                    index={index}
                                    yellowLabel={element.yellowLabel}
                                    typeOfPMC="audioTour"
                                />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid item xs={12} md={6} className={`${style.ticketsTwoColItem} flowBoxItem`}>
                    <Box sx={{ marginBottom: '2rem' }}>
                        <Typography variant="h4" component="h2" className={`${style.sectionHeader} ${style.sectionHeaderTickets} largeHeading`}>
                            {moreFunProducts?.find(x => x.isDonation === true)?.title}
                        </Typography>
                        <Typography variant="h6" component="h6" className={`${style.sectionHeader} ${style.sectionHeaderTickets} subHeadingMD`}>
                            {moreFunProducts?.find(x => x.isDonation === true)?.description}
                        </Typography>
                    </Box>
                    {(moreFunProducts?.filter(x => x.isDonation === true)?.length ?? 0) > 0 &&
                        <Grid className={style.donation} item xs={12} md={12}>
                            <Box className={cardStyle.PlusMinusCard}>
                                <Box className={cardStyle.card}>
                                    <Stack direction="column">
                                        <Box className={cardStyle.information}>
                                        </Box>
                                        <Box>
                                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignContent: 'space-between', alignItems: 'center' }}>
                                                {moreFunProducts?.filter(x => x.isDonation === true).map((e, i) => {
                                                    return (
                                                        <Button sx={{ flexGrow: 1, marginInline: "2px" }}
                                                            key={i}
                                                            onClick={() => { HandleDonationSelect(e.variantId) }}
                                                            variant={selectedDonation === e.variantId ? "contained" : "outlined"}>
                                                            {e.subText}
                                                        </Button>
                                                    )
                                                })}
                                            </Stack>
                                        </Box>
                                        {/* // @james */}
                                        {isCustomDonation && <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: "8px" }}>
                                            <TextField
                                                sx={{ flexGrow: 2 }}
                                                InputProps={{
                                                    inputProps: { min: 1, max: 1000, step: '1.00', pattern: "^\d*(\.\d{0,2})?$" },
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                                }}
                                                label="Custom Amount"
                                                variant="filled"
                                                value={customDonationAmount}
                                                // value={count}
                                                onChange={(e: object) => { console.log(e); HandleDonationSet(e); }}
                                                type="number"
                                                placeholder="$">
                                            </TextField>
                                            <Box className={style.customAmountArrows}>
                                                <Box className={style.customAmountArrowsItem} onClick={incrementDonation}>
                                                    ▲
                                                </Box>
                                                <Box className={style.customAmountArrowsItem} onClick={decrementDonation}>
                                                    ▼
                                                </Box>
                                            </Box>

                                        </Box>}
                                        {/* <Box sx={{ display: "block", width: "100%", textAlign: "center" }}>
                                            {count}
                                        </Box> */}
                                    </Stack>
                                </Box>
                            </Box>
                        </Grid>
                    }
                </Grid>
            </Grid>

            <Box className={`${style.bottomActionBar} bottomActionBar`}>
                <Grid container maxWidth="lg" spacing={0} sx={{ margin: 'auto' }}>
                    <Grid item xs={12} md={6} sx={{ display: ['none', 'none', 'inherit'] }}>
                        <Button onClick={() => { stepBackward() }} className={`${style.bottomActionBack} bottomActionBack buttonBase`}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Box sx={{ textAlign: ['center', 'right', 'right'] }}>
                            <ContinueWithPrice
                                price={[0].concat(addedMoreFunProducts.map(x => x.totalCost)).reduce((p, c) => p + c)}
                                path="./summary"
                                disabled={adding}
                                onContinue={() => { updateCart(); }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            
        </>
    )
}

export default MoreFun