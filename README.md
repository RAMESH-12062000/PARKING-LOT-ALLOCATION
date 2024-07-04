# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.


Here, you can efficiently manage and allocate parking spots. Our system ensures a hassle-free parking experience with real-time tracking and management. 
                        Secure your spot now and experience the convenience."




<mvc:View
    controllerName="com.app.parkinglotallocation.controller.Supervisor"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.uxap"
    xmlns:layout="sap.ui.layout"
    xmlns:form="sap.ui.layout.form"
    xmlns:m="sap.m"
    xmlns:core="sap.ui.core"
    displayBlock="true"
    height="100%"
>
    <ObjectPageLayout
        id="ObjectPageLayout"
        enableLazyLoading="true"
        useIconTabBar="true"
        upperCaseAnchorBar="false"
    >
        <!-- Supervisor Information Section -->
        <headerTitle>
            <ObjectPageDynamicHeaderTitle id="idObjectPageDynamicHeaderTitle">
                <expandedHeading>
                    <m:Title
                        id="idUserInformation"
                        text="Supervisor Info:"
                        wrapping="true"
                    />
                </expandedHeading>
                <snappedHeading>
                    <m:FlexBox
                        id="idFlexBoxUser1"
                        fitContainer="true"
                        alignItems="Center"
                    >
                        <m:Avatar
                            id="idUserAvatar"
                            displaySize="S"
                            src="./Images/img(3).jpeg"
                            class="sapUiTinyMarginEnd"
                        />
                        <m:Label
                            id="idLableUser"
                            text="Name:"
                        />
                        <m:Title
                            id="idTitleUserInfo"
                            text="{supervisor>/name}"
                            wrapping="true"
                        />
                    </m:FlexBox>
                </snappedHeading>
                <expandedContent>
                    <m:Text
                        id="idTextUser"
                        text="Welcome, {supervisor>/name}"
                    />
                </expandedContent>
                <actions>
                    <m:Button
                        id="idBtnHistory"
                        text="History"
                        type="Neutral"
                        icon="sap-icon://customer-history"
                        press="onHistoryBtnPress"
                        tooltip="History"
                    />
                    <m:Button
                        id="idBtn"
                        icon="sap-icon://log"
                        press="onLogoutBtnPress"
                        tooltip="Logout"
                    />
                </actions>
            </ObjectPageDynamicHeaderTitle>
        </headerTitle>

        <headerContent>
            <m:VBox id="idVBoxUser1">
                <m:FlexBox
                    id="idFlexBoxUser2"
                    wrap="Wrap"
                    fitContainer="true"
                >
                    <m:Avatar
                        id="idAvatarUser2"
                        displaySize="L"
                        class="sapUiSmallMarginEnd"
                        src="./Images/img(3).jpeg"
                    />
                    <m:VBox id="idVBox">
                        <layout:HorizontalLayout
                            id="idHorizontal1"
                            class="sapUiSmallMarginBeginEnd"
                        >
                            <m:Label
                                id="idLableUserName1"
                                text="Name:"
                            />
                            <m:Text
                                id="idTextUseName1"
                                text="{supervisor>/name}"
                            />
                        </layout:HorizontalLayout>
                        <layout:HorizontalLayout
                            id="idHorizontal2"
                            class="sapUiSmallMarginBeginEnd"
                        >
                            <m:Label
                                id="idLableuserUserName2"
                                text="Designation:"
                            />
                            <m:Text
                                id="idTextuserUseName2"
                                text="{supervisor>/position}"
                            />
                        </layout:HorizontalLayout>
                        <layout:HorizontalLayout
                            id="idHorizontal3"
                            class="sapUiSmallMarginBeginEnd"
                        >
                            <m:Label
                                id="idLablePhoneNumber3"
                                text="Phonenumber:"
                            />
                            <m:Link
                                id="idTextPhonenymber3"
                                text="{supervisor>/phone}"
                            />
                        </layout:HorizontalLayout>
                        <layout:HorizontalLayout
                            id="idHorizontal4"
                            class="sapUiSmallMarginBeginEnd"
                        >
                            <m:Label
                                id="idLableEmail4"
                                text="Email:"
                            />
                            <m:Link
                                id="idTextEmail4"
                                text="{supervisor>/contact}"
                            />
                        </layout:HorizontalLayout>
                    </m:VBox>
                </m:FlexBox>
            </m:VBox>
        </headerContent>

        <!-- Left Panel and Right Image Section -->
        <sections>
            <ObjectPageSection
                id="idSection1"
                title="Parking Information:"
            >
                <ObjectPageSubSection id="idObjectPage">
                    <blocks>
                        <m:HBox
                            id="idHBoxLeftPanel"
                            fitContainer="true"
                        >
                            <!-- Left Panel -->
                            <m:VBox
                                id="idVBoxLeftPanel"
                                width="20%"
                            >
                                <m:ToolbarSeparator id="id4" />
                                <m:Button
                                    id="idBtnLotAssign"
                                    text="PARKING LOT ASSIGNMENT"
                                    type="Transparent"
                                    press="onNavPress"
                                />
                                <m:ToolbarSeparator id="id" />
                                <m:Button
                                    id="idBtnAllSlots"
                                    text="ALL SLOTS"
                                    type="Transparent"
                                    press="onNavPress"
                                />
                                <m:ToolbarSeparator id="id2" />
                                <m:Button
                                    id="idBtnAllocatedSlots"
                                    text="ALLOCATED SLOTS"
                                    type="Transparent"
                                    press="onNavPress"
                                />
                                <m:ToolbarSeparator id="id3" />
                                <m:Button
                                    id="idBtnEmptySlots"
                                    text="EMPTY SLOTS"
                                    type="Transparent"
                                    press="onNavPress"
                                />
                                <!-- <m:Button text="HISTORY" type="Transparent" press="onNavPress"/> -->
                            </m:VBox>
                            <!-- Right Image -->
                            <m:VBox
                                id="dynamicContent"
                                width="80%"
                                alignItems="Center"
                                justifyContent="Center"
                            >
                                <m:Image
                                    id="IdImageright"
                                    src="./Images/image2.jpeg"
                                    width="100%"
                                    height="auto"
                                />
                            </m:VBox>
                        </m:HBox>
                    </blocks>
                </ObjectPageSubSection>
            </ObjectPageSection>
        </sections>
    </ObjectPageLayout>
</mvc:View>


<Button icon="sap-icon://drop-down-list" />