package pl.pistolrange.pistolrange_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.persistance.QuestionsRepository;

@Service
@RequiredArgsConstructor
public class LearnService {
    private QuestionsRepository questionsRepository;

    public QuestionDto getQuestionByCategory() {
        return null;
    }
}
