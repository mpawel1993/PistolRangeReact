package pl.pistolrange.pistolrange_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.QuestionEntity;
import pl.pistolrange.pistolrange_server.mapper.QuestionMapper;
import pl.pistolrange.pistolrange_server.persistance.QuestionsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final QuestionsRepository questionsRepository;
    private final QuestionMapper questionMapper;

    public void importQuestions(List<QuestionEntity> questionEntityList) {
        questionsRepository.deleteAll();
        questionsRepository.saveAll(questionEntityList);
    }

    public List<QuestionDto> exportQuestions() {
        return questionsRepository.findAll().stream().map(questionMapper::mapToDto).toList();
    }
}
