package com.ris.rentalinspectionsystem.dao;

import com.ris.rentalinspectionsystem.model.History;
import com.ris.rentalinspectionsystem.repositories.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Component
public class HistoryDao {

    private final HistoryRepository historyRepository;

    @Autowired
    public HistoryDao(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<History> getHistory(Long inspectorId) {
        List<History> res = historyRepository.findByInspectorId(inspectorId);
        Collections.sort(res, (e1, e2) -> e2.getViewDate().compareTo(e1.getViewDate()));
        return res; 
    }

    public History createHistory(Long inspectorId, Long estateId) {
        History prev = historyRepository.findByInspectorIdAndEstateId(inspectorId, estateId);
        Long prevId = prev == null ? null : prev.getHistoryId();
        History history = new History(
                prevId,
                inspectorId,
                estateId,
                Timestamp.from(Instant.now())
        );
        return historyRepository.save(history);
    }
}
