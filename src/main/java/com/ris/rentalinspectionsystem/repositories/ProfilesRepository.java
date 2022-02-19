package com.ris.rentalinspectionsystem.repositories;

import com.ris.rentalinspectionsystem.model.Profile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilesRepository extends CrudRepository<Profile, Long> {
    Profile findByInspectorId(Long inspectorId);
}
