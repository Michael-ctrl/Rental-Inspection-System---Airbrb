package com.ris.rentalinspectionsystem.dao;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.ris.rentalinspectionsystem.model.Inspector;
import com.ris.rentalinspectionsystem.model.Login;
import com.ris.rentalinspectionsystem.model.Profile;
import com.ris.rentalinspectionsystem.repositories.InspectorsRepository;
import com.ris.rentalinspectionsystem.repositories.ProfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InspectorDao {

    private final InspectorsRepository inspectorsRepository;
    private final ProfilesRepository profilesRepository;

    @Autowired
    public InspectorDao(
            InspectorsRepository inspectorsRepository,
            ProfilesRepository profilesRepository
    ) {
        this.inspectorsRepository = inspectorsRepository;
        this.profilesRepository = profilesRepository;
    }

    public List<Inspector> getInspectors() { return (List<Inspector>) inspectorsRepository.findAll(); }

    public Inspector getInspector(Long id) { return inspectorsRepository.findById(id).orElse(null); }

    public Profile getProfile(Long inspectorId) { return profilesRepository.findByInspectorId(inspectorId); }

    public Profile patchProfile(Long inspectorId, Profile profile) {

        Profile storedProfile = profilesRepository.findByInspectorId(inspectorId);
        Profile newProfile = new Profile(
                storedProfile.getProfileId(),
                storedProfile.getInspectorId(),
                profile.getBedrooms() == null ? storedProfile.getBedrooms() : profile.getBedrooms(),
                profile.getBathrooms() == null ? storedProfile.getBathrooms() : profile.getBathrooms(),
                profile.getGarages() == null ? storedProfile.getGarages() : profile.getGarages(),
                profile.getPropertyType() == null ? storedProfile.getPropertyType() : profile.getPropertyType(),
                profile.getLandSqmMin() == null ? storedProfile.getLandSqmMin() : profile.getLandSqmMin(),
                profile.getLandSqmMax() == null ? storedProfile.getLandSqmMax() : profile.getLandSqmMax(),
                profile.getPriceMin() == null ? storedProfile.getPriceMin() : profile.getPriceMin(),
                profile.getPriceMax() == null ? storedProfile.getPriceMax() : profile.getPriceMax()
        );

        return profilesRepository.save(newProfile);
    }

    public Inspector createInspector(Inspector inspector) {
        Inspector createdInspector = inspectorsRepository.save(inspector);
        createProfile(
                new Profile(
                        null,
                        createdInspector.getInspectorId(),
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )

        );
        return createdInspector;
    }

    public Profile createProfile(Profile profile) {
        return profilesRepository.save(profile);
    }

    public Inspector putInspector(Long inspectorId, Inspector inspector) {
        inspector.setInspectorId(inspectorId);
        return inspectorsRepository.save(inspector);
    }

    public String login(Login login) {

        List<Inspector> inspectors = inspectorsRepository.findByEmailAndPassword(login.getUsername(), login.getPassword());
        if (inspectors.size() != 1) {
            return null;
        } else {
            Inspector inspector = inspectors.get(0);
            // Generate a token for the agent.
            JWTCreator.Builder jwtBuilder = JWT.create().withClaim("id", inspector.getInspectorId());
            return jwtBuilder.sign(Algorithm.HMAC256("rental-inspection-system"));
        }

    }
}
